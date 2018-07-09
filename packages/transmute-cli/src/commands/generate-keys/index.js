const path = require('path');

const fse = require('fs-extra');

const openpgp = require('openpgp');

const writeFile = async (filePath, fileData) => {
  return new Promise((resolve, reject) => {
    fse.outputFile(filePath, fileData, err => {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
};

module.exports.generateKeys = async (args) => {
  const secOptions = {
    userIds: [
      {
        name: args.name,
        email: args.email
      }
    ],
    curve: 'secp256k1',
    passphrase: args.passphrase
  };

  // create primary key
  const primaryKeyPair = await openpgp.generateKey(secOptions);
  const primarySk = openpgp.key.readArmored(primaryKeyPair.privateKeyArmored)
    .keys[0];
  await primarySk.decrypt(args.passphrase);

  // create recovery key
  const recoveryKeyPair = await openpgp.generateKey(secOptions);
  const recoverySk = openpgp.key.readArmored(recoveryKeyPair.privateKeyArmored)
    .keys[0];
  await recoverySk.decrypt(args.passphrase);

  // recovery key trusts trusts primary key
  const trustedSec = await primarySk.toPublic().signPrimaryUser([recoverySk]);

  // lock the private keys before exporting them
  await primarySk.encrypt(args.passphrase);
  await recoverySk.encrypt(args.passphrase);

  let transmuteDir = path.join(require('os').homedir(), '.transmute/cli-secrets');

  await writeFile(path.join(transmuteDir, 'primary_pk.asc'), trustedSec.armor());
  await writeFile(path.join(transmuteDir, 'recovery_pk.asc'), recoverySk.toPublic().armor());

  await writeFile(path.join(transmuteDir, 'primary_sk.key'), primarySk.armor());
  await writeFile(path.join(transmuteDir, 'recovery_sk.key'), recoverySk.armor());

  console.info('Keys saved.');
  console.info('Primary key path: ', path.join(transmuteDir, 'primary_pk.asc'));
  console.info('Recovery key path: ', path.join(transmuteDir, 'recovery_pk.asc'));
}

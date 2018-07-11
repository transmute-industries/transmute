const path = require('path');

const openpgp = require('openpgp');

const run = require('../runner');

const shell = require('shelljs');

const { writeFile, readFile, removeFile } = require('../../utils');

module.exports.generateRecoveryKey = async (args) => {

  let transmuteDir = path.join(require('os').homedir(), '.transmute/cli-secrets');

  let command = `${path.join(__dirname, './gpg_export ')} ${args.fingerprint}`;
  run.shellExec(command);

  // fetch existing recovery key as new primary key
  const data = await readFile(
    path.join(transmuteDir, 'primary_pk.asc')
  );
  const armoredPrimaryPk = data.toString();
  const primaryPk = openpgp.key.readArmored(
    armoredPrimaryPk
  ).keys[0];

  // create new recovery key
  const secOptions = {
    userIds: [
      {
      }
    ],
    curve: 'secp256k1',
    passphrase: args.passphrase
  };

  const recoveryKeyPair = await openpgp.generateKey(secOptions);
  const recoverySk = openpgp.key.readArmored(recoveryKeyPair.privateKeyArmored)
    .keys[0];
  await recoverySk.decrypt(args.passphrase);

  // new recovery key trusts trusts new primary key
  const trustedSec = await primaryPk.signPrimaryUser([recoverySk]);

  // lock the private keys before exporting them
  await recoverySk.encrypt(args.passphrase);

  // write private keys temporarily to secrets directory
  await writeFile(path.join(transmuteDir, 'recovery_sk.key'), recoverySk.armor());

  console.info('\nImporting new recovery key into local GPG keyring...\n')

  // import private key into GPG keyring
  command = path.join(__dirname, './gpg_import ')
  run.shellExec(command)

  console.info('\nCleaning up...\n')

  // remove temporary files from secrets directory
  await removeFile(path.join(transmuteDir, 'primary_pk.asc'))
  await removeFile(path.join(transmuteDir, 'recovery_sk.key'))

  console.info('\nSuccess!\n')
} 

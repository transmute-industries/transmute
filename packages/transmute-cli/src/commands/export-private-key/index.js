const path = require('path');

const openpgp = require('openpgp');

const run = require('../runner');

const shell = require('shelljs');

const { readFile, removeFile } = require('../../utils');

module.exports.exportPrivateKey = async (args) => {

  let transmuteDir = path.join(require('os').homedir(), '.transmute/cli-secrets');

  let command = `${path.join(__dirname, './gpg_export ')} ${args.fingerprint}`;
  run.shellExec(command);

  // fetch existing recovery key as new primary key
  const data = await readFile(
    path.join(transmuteDir, 'primary_sk.key')
  );
  const armoredPrimarySk = data.toString();
  const primarySk = openpgp.key.readArmored(
    armoredPrimarySk
  ).keys[0];
  await primarySk.decrypt(args.passphrase);

  // remove temporary files from secrets directory
  await removeFile(path.join(transmuteDir, 'primary_sk.key'))

  const privateKey = Buffer.from(primarySk.primaryKey.params[2].data).toString('hex');

  console.info('Your private key: ', privateKey);
} 
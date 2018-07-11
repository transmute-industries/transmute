const path = require('path')

const openpgp = require('openpgp')

const run = require('../runner')

const { writeFile, removeFile } = require('../../utils')

module.exports.generateKeys = async (args) => {
  const secOptions = {
    userIds: [
      {
      }
    ],
    curve: 'secp256k1',
    passphrase: args.passphrase
  }

  // create primary key
  const primaryKeyPair = await openpgp.generateKey(secOptions)
  const primarySk = openpgp.key.readArmored(primaryKeyPair.privateKeyArmored)
    .keys[0]
  await primarySk.decrypt(args.passphrase)

  // create recovery key
  const recoveryKeyPair = await openpgp.generateKey(secOptions)
  const recoverySk = openpgp.key.readArmored(recoveryKeyPair.privateKeyArmored)
    .keys[0]
  await recoverySk.decrypt(args.passphrase)

  // sign primary key with recovery key
  const trustedSec = await primarySk.toPublic().signPrimaryUser([recoverySk])

  // lock private keys before exporting them
  await primarySk.encrypt(args.passphrase)
  await recoverySk.encrypt(args.passphrase)

  let transmuteDir = path.join(require('os').homedir(), '.transmute/cli-secrets')

  // write private keys temporarily to secrets directory
  await writeFile(path.join(transmuteDir, 'primary_sk.key'), primarySk.armor())
  await writeFile(path.join(transmuteDir, 'recovery_sk.key'), recoverySk.armor())

  console.info('\nImporting keys into local GPG keyring...\n')

  // import private keys into GPG keyring
  let command = path.join(__dirname, './gpg_import ')
  run.shellExec(command)

  console.info('\nCleaning up...\n')

  // remove temporary files from secrets directory
  await removeFile(path.join(transmuteDir, 'primary_sk.key'))
  await removeFile(path.join(transmuteDir, 'recovery_sk.key'))

  console.info('\nSuccess!\n')
} 

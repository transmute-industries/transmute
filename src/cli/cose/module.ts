
import key from "./key"

export const command = 'cose <resource> <action>'

export const describe = 'cose operations'

export const builder = (yargs) => {
  return yargs
    .positional('resource', {
      describe: 'The cose resource',
      type: 'string',
    })
    .positional('action', {
      describe: 'The operation on the cose resource',
      type: 'string',
    })
    .option('env', {
      alias: 'e',
      description: 'Relative path to .env',
      demandOption: false,
    })
    .option('detached', {
      alias: 'd',
      description: 'Detached payload',
      default: true
    })
    .option('did-jwk', {
      alias: 'did-jwk',
      description: 'Use did:jwk',
      default: true
    })
    .option('kid', {
      alias: 'kid',
      description: 'Key id',
    })
    .option('input', {
      alias: 'i',
      description: 'File path as input',
    })
    .option('output', {
      alias: 'o',
      description: 'File path as output',
    })
}

const resources = {
  key
}

export const handler = async function (argv) {
  const { resource, action } = argv
  if (resources[resource][action]) {
    resources[resource][action](argv)
  }
}

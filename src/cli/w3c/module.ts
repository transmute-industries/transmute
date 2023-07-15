
import credential from "./credential"
import presentation from "./presentation"
import statusList from "./status-list"
import controller from "./controller"

export const resources = {
  credential,
  presentation,
  controller,
  ['status-list']: statusList
}

export const command = 'w3c <resource> <action>'

export const describe = 'w3c operations'

export const builder = (yargs) => {
  return yargs
    .positional('resource', {
      describe: 'The w3c resource',
      type: 'string',
    })
    .positional('action', {
      describe: 'The operation on the w3c resource',
      type: 'string',
    })
    .option('output', {
      alias: 'o',
      description: 'File path as output',
    })
    .option('env', {
      alias: 'e',
      description: 'Relative path to .env',
      demandOption: false,
    })
    // cose / jose specific
    .option('issuer-key', {
      description: 'Path to issuer private key (jwk)',
    })
    .option('issuer-kid', {
      description: 'Identifier to use for issuer kid',
    })
    // w3c specific
    .option('holder-key', {
      description: 'Path to holder private key (jwk)',
    })
    .option('holder-kid', {
      description: 'Identifier to use for holder kid',
    })
    .option('did-resolver', {
      description: 'Base URL of a w3c did resolver api',
      default: 'https://transmute.id/api'
    })
    .option('verifiable-credential', {
      description: 'Path to a verifiable credential',
    })
    .option('verifiable-presentation', {
      description: 'Path to a verifiable presentation',
    })
}

export const handler = async function (argv) {
  const { resource, action } = argv
  if (resources[resource][action]) {
    resources[resource][action](argv)
  }
}

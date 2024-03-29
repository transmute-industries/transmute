
import key from './key'
import statement from "./statement"
import ledger from "./ledger"
import transparent from "./transparent"
import certificate from "./certificate"

export const resources = {
  certificate,
  key,
  statement,
  ledger,
  transparent,
}

export const command = 'scitt <resource> <action> [action2]'

export const describe = 'scitt operations'

export const builder = (yargs) => {
  return yargs
    .positional('resource', {
      describe: 'The scitt resource',
      type: 'string',
    })
    .positional('action', {
      describe: 'The operation on the scitt resource',
      type: 'string',
    })
    .option('env', {
      alias: 'e',
      description: 'Relative path to .env',
      demandOption: false,
    })
    .option('output', {
      alias: 'o',
      description: 'File path as output',
    })
    // cose / jose specific
    .option('issuer-key', {
      description: 'Path to issuer private key (jwk)',
    })
    .option('issuer-kid', {
      description: 'Identifier to use for kid',
    })
    // scitt specific
    .option('did-resolver', {
      description: 'Base URL of a did resolver api',
      default: 'https://transmute.id/api'
    })
    .option('transparency-service', {
      description: 'Base URL of a scitt transparency service api',
      default: 'http://localhost:3000/api/did:web:scitt.xyz'
    })
    .option('statement', {
      description: 'Path to statement',
    })
    .option('signed-statement', {
      description: 'Path to signed-statement',
    })
    // this is the same thing as a receipt... or is it?
    // .option('signed-inclusion-proof', {
    //   description: 'Path to signed-inclusion-proof',
    // })
    .option('receipt', {
      description: 'Path to receipt',
    })
    .option('transparent-statement', {
      description: 'Path to transparent-statement',
    })
}

export const handler = async function (argv) {
  const { resource, action, action2 } = argv
  if (action2) {
    resources[resource][action][action2](argv)
  } else if (resources[resource][action]) {
    resources[resource][action](argv)
  }
}

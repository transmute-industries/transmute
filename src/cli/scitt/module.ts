
import statement from "./statement"
import receipt from "./receipt"

export const resources = {
  statement,
  receipt
}

export const command = 'scitt <resource> <action>'

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
    // scitt specific
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
  const { resource, action } = argv
  if (resources[resource][action]) {
    resources[resource][action](argv)
  }
}

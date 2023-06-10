import key from './key'

const resources = {
  key,
}

const register = (yargs) => {
  yargs.command(
    'controller [resource] [action]',
    'controller operations',
    {
      crv: {
        alias: 'crv',
        description:
          'See https://www.iana.org/assignments/jose#web-key-elliptic-curve',
      },
      alg: {
        alias: 'alg',
        description:
          'See https://www.iana.org/assignments/jose#web-signature-encryption-algorithms',
      },
      output: {
        alias: 'o',
        description: 'Path to output',
      },
    },
    async (argv) => {
      const { resource, action } = argv
      if (resources[resource]) {
        if (key[action]) {
          await key[action](argv)
        }
      }
    },
  )
}
const graph = { register }
export default graph

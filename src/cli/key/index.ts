import generateKey from './generate'
import exportKey from './export'
import encryptToKey from './encrypt'
import decryptWithKey from './decrypt'

import signWithKey from './sign'
import verifyWithKey from './verify'

const key = {
  generate: generateKey,
  export: exportKey,
  encrypt: encryptToKey,
  decrypt: decryptWithKey,
  sign: signWithKey,
  verify: verifyWithKey,
}

const register = (yargs) => {
  yargs.command(
    'key [action]',
    'key operations',
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
      const { action } = argv
      if (key[action]) {
        await key[action](argv)
      }
    },
  )
}
const graph = { register }
export default graph

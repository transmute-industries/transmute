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
  verify: verifyWithKey
}

export default key

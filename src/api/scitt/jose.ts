import * as jose from 'jose'
import { detachedHeaderParams } from '../controller/utils'

// TODO Remote KMS.
const signer = async (privateKeyJwk) => {
  const { alg } = privateKeyJwk
  const privateKey = await jose.importJWK(privateKeyJwk)
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sign: async (bytes: Uint8Array, headers: any = {}) => {
      return new jose.FlattenedSign(bytes)
        .setProtectedHeader({ alg, ...headers, ...detachedHeaderParams })
        .sign(privateKey)
    },
  }
}

const api = { signer }
export default api

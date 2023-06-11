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

// TODO Remote KMS.
const verifier = async (publicKeyJwk) => {
  const { alg } = publicKeyJwk
  const publicKey = await jose.importJWK(publicKeyJwk)
  return {
    alg: alg,
    verify: async (jws: {
      protected: string
      payload: Uint8Array
      signature: string
    }) => {
      const { protectedHeader, payload } = await jose.flattenedVerify(
        jws,
        publicKey,
      )
      return { protectedHeader, payload }
    },
  }
}


const api = { signer, verifier }
export default api

import * as jose from 'jose'

// TODO Remote KMS.
const signer = async (privateKeyJwk) => {
  const { alg } = privateKeyJwk
  const privateKey = await jose.importJWK(privateKeyJwk)
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sign: async (bytes: Uint8Array, headers: any = {}) => {
      return new jose.CompactSign(bytes)
        .setProtectedHeader({ alg, ...headers })
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
    verify: async (jws: string) => {
      const { protectedHeader, payload } = await jose.compactVerify(
        jws,
        publicKey,
      )
      return { protectedHeader, payload }
    },
  }
}


const api = { signer, verifier }
export default api

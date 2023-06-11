import * as jose from 'jose'

import { VerifiablePresentation, VpJwtHeader } from './types'
// TODO Remote KMS.
const signer = async (privateKeyJwk) => {
  const { alg } = privateKeyJwk
  const privateKey = await jose.importJWK(privateKeyJwk)
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sign: async (
      claimset: VerifiablePresentation,
      header: VpJwtHeader = { alg, typ: 'vp+ld+jwt' },
    ) => {
      return new jose.FlattenedSign(
        new TextEncoder().encode(JSON.stringify(claimset)),
      )
        .setProtectedHeader(header)
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
    verify: async (jws: jose.FlattenedJWS) => {
      const { protectedHeader, payload } = await jose.flattenedVerify(
        jws,
        publicKey,
      )
      return { protectedHeader, claimset: JSON.parse(payload.toString()) }
    },
  }
}

const api = { signer, verifier }
export default api

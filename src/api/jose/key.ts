import * as jose from 'jose'

import attached from './attached'
import detached from './detached'

export type RequestGenerateKey = {
  alg: string
  crv?: string
}

const generate = async (
  { crv, alg }: RequestGenerateKey,
  extractable = true,
) => {
  if (alg === 'ECDH-ES+A128KW' && crv === undefined) {
    crv = 'P-384'
  }
  if (alg === 'HPKE-B0') {
    throw new Error('HPKE is not supported.')
  }
  const { publicKey, privateKey } = await jose.generateKeyPair(alg, {
    extractable,
    crv,
  })
  const publicKeyJwk = await jose.exportJWK(publicKey)
  const privateKeyJwk = await jose.exportJWK(privateKey)
  privateKeyJwk.alg = alg
  privateKeyJwk.kid = await jose.calculateJwkThumbprintUri(publicKeyJwk)
  return formatJwk(privateKeyJwk)
}

const formatJwk = (jwk) => {
  const {
    kid,
    x5u,
    x5c,
    x5t,
    kty,
    crv,
    alg,
    use,
    key_ops,
    x,
    y,
    d,
    ...rest
  } = jwk
  return JSON.parse(
    JSON.stringify({
      kid,
      kty,
      crv,
      alg,
      use,
      key_ops,
      x,
      y,
      d,
      x5u,
      x5c,
      x5t,
      ...rest,
    }),
  )
}

const publicKeyToUri = async (publicKeyJwk) => {
  return jose.calculateJwkThumbprintUri(publicKeyJwk)
}

const publicFromPrivate = (privateKeyJwk) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { d, p, q, dp, dq, qi, key_ops, ...publicKeyJwk } = privateKeyJwk
  return publicKeyJwk
}

const encryptToKey = async ({ publicKey, plaintext }) => {
  const jwe = await new jose.FlattenedEncrypt(plaintext)
    .setProtectedHeader({ alg: publicKey.alg, enc: 'A256GCM' })
    .encrypt(await jose.importJWK(publicKey))
  return jwe
}

const decryptWithKey = async ({ privateKey, ciphertext }) => {
  return jose.flattenedDecrypt(ciphertext, await jose.importJWK(privateKey))
}

const key = {
  generate,
  format: formatJwk,
  uri: {
    thumbprint: publicKeyToUri,
  },
  publicFromPrivate,
  detached,
  attached,
  recipient: { encrypt: encryptToKey, decrypt: decryptWithKey },
}

export default key

import * as jose from 'jose'

import { isVC } from '../rdf/utils'
import { detachedHeaderParams } from './utils'

const claimsetToTyp = (claimset) => {
  if (isVC(claimset)) {
    return 'vc+ld+jwt'
  } else {
    return 'vp+ld+jwt'
  }
}

const generate = async ({ crv, alg }, extractable = true) => {
  if (alg === 'ECDH-ES+A128KW' && crv === undefined) {
    crv = 'P-384'
  }
  const { publicKey, privateKey } = await jose.generateKeyPair(alg, {
    extractable,
    crv,
  })
  const publicKeyJwk = await jose.exportJWK(publicKey)
  const privateKeyJwk = await jose.exportJWK(privateKey)
  const holder = await jose.calculateJwkThumbprintUri(publicKeyJwk)
  const controller = publicKeyToDid(publicKeyJwk)
  publicKeyJwk.alg = alg
  publicKeyJwk.kid = holder
  privateKeyJwk.alg = alg
  privateKeyJwk.kid = holder

  return {
    id: controller + '#0',
    type: 'JsonWebKey',
    controller: holder,
    publicKeyJwk: formatJwk(publicKeyJwk),
    privateKeyJwk: formatJwk(privateKeyJwk),
  }
}

// TODO Remote KMS.
const signer = async (privateKeyJwk) => {
  const { alg } = privateKeyJwk
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { d, ...publicKewJwk } = privateKeyJwk
  const privateKey = await jose.importJWK(privateKeyJwk)
  return {
    alg: alg,
    iss: publicKeyToDid(publicKewJwk),
    kid: `#0`,
    sign: async (bytes) => {
      const typ = claimsetToTyp(JSON.parse(new TextDecoder().decode(bytes)))
      const jws = await new jose.FlattenedSign(bytes)
        .setProtectedHeader({ alg, typ, ...detachedHeaderParams })
        .sign(privateKey)
      return `${jws.protected}..${jws.signature}`
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
  } = structuredClone(jwk)
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

const publicKeyToDid = (publicKeyJwk) => {
  const id = `did:jwk:${jose.base64url.encode(
    JSON.stringify(formatJwk(publicKeyJwk)),
  )}`
  return id
}

const dereferencePublicKey = async (didUrl: string) =>
  jose.importJWK(
    JSON.parse(
      new TextDecoder().decode(
        jose.base64url.decode(didUrl.split(':')[2].split('#')[0]),
      ),
    ),
  )

const publicKeyToUri = async (publicKeyJwk) => {
  return jose.calculateJwkThumbprintUri(publicKeyJwk)
}

const publicKeyToKid = async (publicKeyJwk) => {
  return '#' + publicKeyToUri(publicKeyJwk)
}

const publicFromPrivate = (privateKeyJwk: any) => {
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
  uri: publicKeyToUri,
  did: publicKeyToDid,
  kid: publicKeyToKid,
  dereferencePublicKey,
  publicFromPrivate,
  encryptToKey,
  decryptWithKey,
}

const controller = { key, signer, verifier }

export default controller

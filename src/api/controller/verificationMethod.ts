import * as jose from 'jose'

import key from '../jose/key'

const create = async (
  publicKeyJwk
) => {
  const holder = await jose.calculateJwkThumbprintUri(publicKeyJwk)
  const controller = publicKeyToDid(publicKeyJwk)
  return {
    id: controller + '#0',
    type: 'JsonWebKey',
    controller: holder,
    publicKeyJwk: key.format(publicKeyJwk)
  }
}

const publicKeyToDid = (publicKeyJwk) => {
  const id = `did:jwk:${jose.base64url.encode(
    JSON.stringify(key.format(publicKeyJwk)),
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

const publicKeyToVerificationMethod = async (publicKeyJwk) => {
  return '#' + key.uri.thumbprint(publicKeyJwk)
}

const verificationMethod = {
  id: publicKeyToVerificationMethod,
  create,
  dereference: dereferencePublicKey,
}

export default verificationMethod

import * as jose from 'jose'

import key from '../jose/key'

export const formatVerificationMethod = (vm) => {
  const formatted = {
    id: vm.id,
    type: vm.type,
    controller: vm.controller,
    publicKeyJwk: vm.publicKeyJwk,
  }
  return JSON.parse(JSON.stringify(formatted))
}

const create = async (publicKeyJwk) => {
  const holder = await jose.calculateJwkThumbprintUri(publicKeyJwk)
  return {
    id: holder,
    type: 'JsonWebKey',
    controller: holder,
    publicKeyJwk: key.format(publicKeyJwk),
  }
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
  format: formatVerificationMethod,
  create,
  dereference: dereferencePublicKey,
}

export default verificationMethod

import * as jose from 'jose'

import key from '../jose/key'

import verificationMethod from './verificationMethod'

const publicKeyToDid = (publicKeyJwk) => {
  const id = `did:jwk:${jose.base64url.encode(
    JSON.stringify(key.format(publicKeyJwk)),
  )}`
  return id
}

const signatures = ['authentication', 'assertionMethod']
const encryptions = ['keyAgreement']
const both = [...signatures, ...encryptions]
const relationships = {
  ES256: both,
  ES384: both,
  EdDSA: signatures,
  X25519: encryptions,
  ES256K: signatures,
}

const did = {
  document: {
    create: async (publicKeyJwk) => {
      const id = publicKeyToDid(publicKeyJwk)
      const vm = await verificationMethod.create(publicKeyJwk)
      const ddoc = {
        '@context': [
          'https://www.w3.org/ns/did/v1',
          { '@vocab': 'https://www.iana.org/assignments/jose#' },
        ],
        id,
        verificationMethod: [
          verificationMethod.format({
            ...vm,
            id: '#0',
            controller: id,
          }),
        ],
      }
      relationships[publicKeyJwk.alg].forEach((vmr) => {
        ddoc[vmr] = [id]
      })
      return ddoc
    },
    identifier: {
      replace: (doc, source, target) => {
        return JSON.parse(
          JSON.stringify(doc, function replacer(key, value) {
            if (value === source) {
              return target
            }
            return value
          }),
        )
      },
    },
  },
}

const controller = { did, key, verificationMethod }

export default controller

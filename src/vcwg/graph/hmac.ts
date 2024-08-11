import crypto from 'crypto'
import { base64url } from 'jose'

const testKey = new Uint8Array(32)
testKey[0] = 1
testKey[31] = 1

const key = () => {
  // return testKey
  return crypto.webcrypto.getRandomValues(new Uint8Array(32))
}

const AlgToHash = {
  HS256: 'sha256',
} as Record<string, 'sha256'>

const signer = async (key: Uint8Array) => {
  const alg = 'HS256'
  const hash = AlgToHash[alg]
  if (!hash) {
    throw new Error('Unsupoorted HMAC')
  }
  return {
    export: (kid = '#hmac') => {
      const jwk = {
        kid: kid,
        kty: 'oct',
        alg: alg,
        use: 'sig',
        key_ops: ['sign'],
        k: base64url.encode(key),
      }
      return jwk
    },
    sign: async (bytes: Uint8Array) => {
      const hmac = crypto.createHmac(hash, key)
      return new Uint8Array(hmac.update(bytes).digest())
    },
  }
}

export const hmac = { key, signer, testKey }


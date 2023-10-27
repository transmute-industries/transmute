
const crypto = require('crypto');
const x509 = require("@peculiar/x509");
const jose = require('jose')

// https://github.com/PeculiarVentures/x509
x509.cryptoProvider.set(crypto);

const x5t = (hash: string, cert: string) => jose.base64url.encode(crypto.createHash(hash).update(Buffer.from(cert, 'base64')).digest())

const verifyCertificateChain = async ({ alg, x5c }: any, date: Date) => {
  const initialValue = {}
  const accumulated = await x5c.reduce(
    async (accumulator: any, currentValue: any, currentIndex: any) => {
      const next = await accumulator;
      const current = new x509.X509Certificate(currentValue)
      const currentPublicKey = await jose.importX509(current.toString(), alg)
      const currentPublicKeyJwk = await jose.exportJWK(currentPublicKey)
      currentPublicKeyJwk.alg = alg
      currentPublicKeyJwk.kid = await jose.calculateJwkThumbprintUri(currentPublicKeyJwk)
      currentPublicKeyJwk['x5t#S256'] = x5t('sha256', currentValue);
      currentPublicKeyJwk.x5c = x5c.slice(currentIndex, x5c.length)
      next.keys = next.keys || [currentPublicKeyJwk]
      // first key 
      if (next.previous === undefined) {
        next.previous = currentValue;
      } else {
        const previous = new x509.X509Certificate(next.previous)
        const verified = await previous.verify({
          date, // verify as of date... defaults to now...
          publicKey: await current.publicKey.export() // root public key
        });
        if (verified) {
          next.keys.push(currentPublicKeyJwk)
          next.previous = currentValue;
        } else {
          throw new Error('Failed to verify x5c.')
        }
      }
      return next
    },
    initialValue
  );
  const root = new x509.X509Certificate(accumulated.previous)
  const rootValid = await root.verify({ date });
  const isSelfSigned = await root.isSelfSigned()
  if (!isSelfSigned) {
    throw new Error('Root certificate must be self signed.')
  }
  if (!rootValid) {
    throw new Error('Root certificate failed to verify.')
  }
  delete accumulated.previous;
  return accumulated
}

export const verifyX5C = async (alg: string, x5c: string[], discoveryTime: Date) => {
  const jwks = await verifyCertificateChain({ alg, x5c }, discoveryTime)
  return jwks
}
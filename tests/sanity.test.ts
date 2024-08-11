import * as cose from '@transmute/cose'

it('sanity', async () => {
  const privateKey = await cose.key.generate<cose.key.CoseKey>('ES256', 'application/cose-key')
  const publicKey = await cose.key.extractPublicCoseKey(privateKey)
  const signer = cose.attached.signer({
    remote: cose.crypto.signer({
      privateKeyJwk: await cose.key.convertCoseKeyToJsonWebKey(privateKey),
    }),
  })
  const verifier = cose.attached.verifier({
    resolver: {
      resolve: async () => {
        return cose.key.convertCoseKeyToJsonWebKey(publicKey)
      }
    }
  })
  const message = new TextEncoder().encode('hello world')
  const coseSign1 = await signer.sign({
    protectedHeader: cose.ProtectedHeader([
      [cose.Protected.Alg, privateKey.get(3)],
    ]),
    unprotectedHeader: new Map<any, any>(),
    payload: message,
  })
  const result = await verifier.verify({
    coseSign1
  })
  expect(new TextDecoder().decode(result)).toBe('hello world')
})


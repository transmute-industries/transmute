/* eslint-disable @typescript-eslint/no-var-requires */

import controller from '../src/api/controller'

describe('detached', () => {
  it('generate / sign / verify', async () => {
    const k = await controller.key.generate({ alg: 'ES384' })
    const signer = await controller.detached.signer(k.privateKeyJwk)
    const verifier = await controller.detached.verifier(k.publicKeyJwk)
    const message = new TextEncoder().encode('hello')
    const jws = await signer.sign(message)
    const verified = await verifier.verify({
      protected: jws.protected as string,
      payload: message,
      signature: jws.signature
    })
    expect(verified.payload).toEqual(message)
  })
})

/* eslint-disable @typescript-eslint/no-var-requires */

import controller from '../src/api/controller'

describe('attached', () => {
  it('generate / sign / verify', async () => {
    const k = await controller.key.generate({ alg: 'ES384' })
    const signer = await controller.attached.signer(k.privateKeyJwk)
    const verifier = await controller.attached.verifier(k.publicKeyJwk)
    const message = new TextEncoder().encode('hello')
    const jws = await signer.sign(message)
    const verified = await verifier.verify(jws)
    expect(verified.payload).toEqual(message)
  })
})

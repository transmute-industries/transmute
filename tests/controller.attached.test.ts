/* eslint-disable @typescript-eslint/no-var-requires */

import controller from '../src/api/controller'

describe('attached', () => {
  it('generate / sign / verify', async () => {
    const privateKey = await controller.key.generate({ alg: 'ES384' })
    const publicKey = controller.key.publicFromPrivate(privateKey)
    const signer = await controller.key.attached.signer(privateKey)
    const verifier = await controller.key.attached.verifier(publicKey)
    const message = new TextEncoder().encode('hello')
    const jws = await signer.sign(message)
    const verified = await verifier.verify(jws)
    expect(verified.payload).toEqual(message)
  })
})

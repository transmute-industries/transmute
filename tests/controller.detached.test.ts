/* eslint-disable @typescript-eslint/no-var-requires */

import controller from '../src/api/controller'

describe('detached', () => {
  it('generate / sign / verify', async () => {
    const privateKey = await controller.key.generate({ alg: 'ES384' })
    const publicKey = controller.key.publicFromPrivate(privateKey)
    const signer = await controller.key.detached.signer(privateKey)
    const verifier = await controller.key.detached.verifier(publicKey)
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

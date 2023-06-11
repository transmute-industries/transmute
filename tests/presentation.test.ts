/* eslint-disable @typescript-eslint/no-var-requires */

import controller from '../src/api/controller'
import vcdm from '../src/api/vcdm'

describe('presentation', () => {
  it('issue / verify', async () => {
    const privateKey = await controller.key.generate({ alg: 'ES384' })
    const publicKey = controller.key.publicFromPrivate(privateKey)
    const signer = await vcdm.vp.signer(privateKey)
    const verifier = await vcdm.vp.verifier(publicKey)
    const presentation = {
      "@context": ["https://www.w3.org/ns/credentials/v2"],
      "type": ["VerifiablePresentation"]
    }
    const jws = await signer.sign(presentation)
    const verified = await verifier.verify(jws)
    expect(verified.claimset).toEqual(presentation)
  })
})

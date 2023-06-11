/* eslint-disable @typescript-eslint/no-var-requires */

import controller from '../src/api/controller'
import vcdm from '../src/api/vcdm'

describe('credential', () => {
  it('issue / verify', async () => {
    const privateKey = await controller.key.generate({ alg: 'ES384' })
    const publicKey = controller.key.publicFromPrivate(privateKey)
    const signer = await vcdm.vc.signer(privateKey)
    const verifier = await vcdm.vc.verifier(publicKey)
    const credential = {
      '@context': ['https://www.w3.org/ns/credentials/v2'],
      type: ['VerifiableCredential'],
      issuer: 'https://issuer.vendor.example',
      validFrom: '2023-06-07T21:14:14.148Z',
      credentialSubject: {
        id: 'https://subject.vendor.example',
      },
    }
    const jws = await signer.sign(credential)
    const verified = await verifier.verify(jws)
    expect(verified.claimset).toEqual(credential)
  })
})

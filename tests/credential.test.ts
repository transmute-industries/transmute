/* eslint-disable @typescript-eslint/no-var-requires */

import controller from '../src/api/controller'
import vcdm from '../src/api/vcdm'

describe('credential', () => {
  it('issue / verify', async () => {
    const k = await controller.key.generate({ alg: 'ES384' })
    const signer = await vcdm.vc.signer(k.privateKeyJwk)
    const verifier = await vcdm.vc.verifier(k.publicKeyJwk)
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

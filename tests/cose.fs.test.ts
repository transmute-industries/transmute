import transmute from '@transmute/did-transmute';
import cose from '@transmute/cose';

import fs from 'fs'

describe("cose", () => {
  it("fs sign and verify", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const {key: {publicKey, privateKey} } = await transmute.did.jwk.exportable({ alg: 'ES384' })
    fs.writeFileSync('examples/cose/private.signing.jwk.json', JSON.stringify(privateKey))
    fs.writeFileSync('examples/cose/public.verifying.jwk.json', JSON.stringify(publicKey))

    const privateKeyFromFile = fs.readFileSync(`examples/cose/private.signing.jwk.json`)
    const publicKeyFromFile = fs.readFileSync(`examples/cose/public.verifying.jwk.json`)
    

    const signer = await cose.detached.signer({ privateKeyJwk: JSON.parse(privateKeyFromFile.toString()) })
    const verifier = await cose.detached.verifier({ publicKeyJwk: JSON.parse(publicKeyFromFile.toString()) })

    const content = fs.readFileSync(`examples/cose/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi.jpg`)
  
    const u = new Map();
    const {signature} = await signer.sign({
      protectedHeader: { alg: privateKey.alg },
      unprotectedHeader: u,
      payload: content
    })
    
    fs.writeFileSync('examples/cose/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi.cose', signature)

    const payloadFromFile = fs.readFileSync(`examples/cose/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi.jpg`)
    const signatureFromFile = fs.readFileSync(`examples/cose/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi.cose`)

    const verified = await verifier.verify({
      payload: payloadFromFile,
      signature: signatureFromFile
    })
    expect(verified).toBe(true)    
  });
});

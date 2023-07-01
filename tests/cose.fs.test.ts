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
    

    const signer = await cose.signer({ privateKeyJwk: JSON.parse(privateKeyFromFile.toString()) })
    const verifier = await cose.verifier({ publicKeyJwk: JSON.parse(publicKeyFromFile.toString()) })

    const message = 'hello'
    const content = Buffer.from(new TextEncoder().encode(message))
  
    const u = new Map();
    const signature = await signer.sign({
      protectedHeader: { alg: privateKey.alg },
      unprotectedHeader: u,
      payload: content
    })

    fs.writeFileSync('examples/cose/payload', content)
    fs.writeFileSync('examples/cose/signature', signature)

    const payloadFromFile = fs.readFileSync(`examples/cose/payload`)
    const signatureFromFile = fs.readFileSync(`examples/cose/signature`)

    const attached = cose.attachPayload({
      signature: signatureFromFile,
      payload: payloadFromFile
    })
    const verified = await verifier.verify(attached)
    expect(new TextDecoder().decode(verified)).toBe(message)    
  });
});


import fs from "fs"
import path from "path"
import transmute from "@transmute/did-transmute"


/*
npm run transmute -- w3c credential issue \
--issuer-key examples/w3c/private.signing.jwk.json \
--issuer-kid did:web:scitt.xyz#urn:ietf:params:oauth:jwk-thumbprint:sha-256:gP8lW7iRNl2u0oE99RtuAQ7hnpWQIfEF8f0n_tK_ch8 \
--claimset  examples/w3c/claimset.json \
--verifiable-credential examples/w3c/vc.jwt
*/

interface RequestIssueVerifiableCredential {
  issuerKey: string
  issuerKid: string
  claimset: string
  verifiableCredential: string
}

const issue = async (argv: RequestIssueVerifiableCredential) => {
  const issuerKey = fs.readFileSync(path.resolve(process.cwd(), argv.issuerKey))
  const issuerKid = argv.issuerKid;
  const privateKey = JSON.parse(issuerKey.toString())
  const signer = await transmute.w3c.controller.key.attached.signer({
    privateKey
  })
  const issuer = await transmute.w3c.vc.issuer({
    signer
  })
  const payload = fs.readFileSync(path.resolve(process.cwd(), argv.claimset))
  const claimset = JSON.parse(payload.toString())
  const vc = await issuer.issue({
    protectedHeader: { alg: privateKey.alg, kid: issuerKid },
    claimset
  })
  fs.writeFileSync(
    path.resolve(process.cwd(), argv.verifiableCredential),
    Buffer.from(vc)
  )
}

export default issue
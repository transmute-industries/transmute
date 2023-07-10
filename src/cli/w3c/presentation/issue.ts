
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

interface RequestIssueVerifiablePresentation {
  holderKey: string
  holderKid: string
  claimset: string
  verifiablePresentation: string
}

const issue = async (argv: RequestIssueVerifiablePresentation) => {
  const holderKey = fs.readFileSync(path.resolve(process.cwd(), argv.holderKey))
  const holderKid = argv.holderKid;
  const privateKey = JSON.parse(holderKey.toString())
  const signer = await transmute.w3c.controller.key.attached.signer({
    privateKey
  })
  const holder = await transmute.w3c.vp.holder({
    signer
  })
  const payload = fs.readFileSync(path.resolve(process.cwd(), argv.claimset))
  const claimset = JSON.parse(payload.toString())
  const vp = await holder.present({
    protectedHeader: { alg: privateKey.alg, kid: holderKid },
    claimset
  })
  fs.writeFileSync(
    path.resolve(process.cwd(), argv.verifiablePresentation),
    Buffer.from(vp)
  )
}

export default issue

import transmute from "@transmute/did-transmute"
import fs from "fs"
import path from "path"


/*
npm run transmute -- w3c status-list update \
--issuer-key examples/w3c/status-list/private.signing.jwk.json \
--verifiable-credential examples/w3c/status-list/status-list.vc.jwt \
--index 0 \
--status true
*/

interface RequestUpdateStatusList {
  issuerKey: string
  index: string
  status: string
  verifiableCredential: string // input and output path
}

const update = async (argv: RequestUpdateStatusList) => {
  const issuerKey = fs.readFileSync(path.resolve(process.cwd(), argv.issuerKey))
  const privateKey = JSON.parse(issuerKey.toString())
  const publicKey = transmute.w3c.controller.key.publicFromPrivate(privateKey)
  const verifier = await transmute.w3c.vc.verifier({
    issuer: () => {
      return publicKey
    }
  })
  const vc = fs.readFileSync(path.resolve(process.cwd(), argv.verifiableCredential))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const verified = await verifier.verify(vc.toString()) as any
  const updatedClaimset = await transmute.w3c.vc.StatusList.updateStatus({
    claimset: verified.claimset,
    position: parseInt(argv.index, 10),
    status: argv.status === 'true',
    purpose: verified.claimset.credentialSubject.statusPurpose
  })
  const signer = await transmute.w3c.controller.key.attached.signer({
    privateKey
  })
  const issuer = await transmute.w3c.vc.issuer({
    signer
  })
  const updatedVc = await issuer.issue({
    protectedHeader: verified.protectedHeader,
    claimset: updatedClaimset
  })
  fs.writeFileSync(
    path.resolve(process.cwd(), argv.verifiableCredential),
    Buffer.from(updatedVc)
  )
}

export default update
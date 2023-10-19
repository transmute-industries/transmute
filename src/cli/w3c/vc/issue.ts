
import fs from "fs"
import path from "path"
import { base64url } from "jose"
import crypto from 'crypto'
import transmute from "@transmute/verifiable-credentials"

interface RequestIssueVerifiableCredential {
  issuerKey: string
  issuerKid: string
  holderKey?: string
  holderKid?: string
  claimset: string
  verifiableCredential: string
}

const getHolder = (argv: RequestIssueVerifiableCredential) => {
  let holder = undefined as string | object | undefined;
  if (argv.holderKey) {
    const holderKey = fs.readFileSync(path.resolve(process.cwd(), argv.issuerKey))
    const publicKeyJwk = JSON.parse(holderKey.toString())
    holder = publicKeyJwk
  }
  if (argv.holderKid) {
    holder = argv.holderKid
  }
  return holder
}

const issue = async (argv: RequestIssueVerifiableCredential) => {
  const issuerKey = fs.readFileSync(path.resolve(process.cwd(), argv.issuerKey))
  const secretKeyJwk = JSON.parse(issuerKey.toString())
  const issuerKid = argv.issuerKid || secretKeyJwk.kid;
  const claimset = fs.readFileSync(path.resolve(process.cwd(), argv.claimset)).toString()
  const holder = getHolder(argv)
  const salter = async () => {
    const array = await crypto.randomFillSync(new Uint8Array(16))
    const encoded = base64url.encode(array);
    return encoded
  }
  const digester = {
    name: 'sha-256',
    digest: async (json: string) => {
      const content = new TextEncoder().encode(json);
      const digest = await crypto.createHash('sha256').update(content).digest();
      return base64url.encode(new Uint8Array(digest));
    }
  }
  const vc = await transmute.vc.sd.issuer({
    kid: issuerKid,
    secretKeyJwk,
    salter,
    digester
  })
    .issue({
      holder,
      claimset
    })
  fs.writeFileSync(
    path.resolve(process.cwd(), argv.verifiableCredential),
    Buffer.from(vc)
  )
}

export default issue
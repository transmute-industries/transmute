
import fs from "fs"
import path from "path"
import { base64url } from "jose"
import crypto from 'crypto'
import transmute from "@transmute/verifiable-credentials"

interface RequestIssueVerifiablePresentation {
  disclosure: string
  verifiableCredential: string
  verifiablePresentation: string

  holderKey?: string
  holderKid?: string
  audience?: string
  nonce?: string
}

const getHolderPrivateKey = (argv: RequestIssueVerifiablePresentation) => {
  let holder = undefined as Record<string, string> | undefined;
  if (argv.holderKey) {
    const holderKey = fs.readFileSync(path.resolve(process.cwd(), argv.holderKey))
    const secretKeyJwk = JSON.parse(holderKey.toString())
    holder = secretKeyJwk
  }
  return holder
}

const issue = async (argv: RequestIssueVerifiablePresentation) => {
  const secretKeyJwk = getHolderPrivateKey(argv)
  const disclosure = fs.readFileSync(path.resolve(process.cwd(), argv.disclosure)).toString()
  const vc = fs.readFileSync(path.resolve(process.cwd(), argv.verifiableCredential)).toString()
  let holderKid = argv.holderKid
  if (secretKeyJwk) {
    holderKid = secretKeyJwk.kid
  }
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
  const audience = argv.audience;
  const nonce = argv.nonce;
  const vp = await transmute.vc.sd.holder({
    kid: holderKid,
    secretKeyJwk,
    salter,
    digester
  })
    .issue({
      token: vc,
      disclosure,
      audience,
      nonce
    })
  fs.writeFileSync(
    path.resolve(process.cwd(), argv.verifiablePresentation),
    Buffer.from(vp)
  )
}

export default issue
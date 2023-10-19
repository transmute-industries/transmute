
import fs from "fs"
import path from "path"
import { base64url } from "jose"
import crypto from 'crypto'
import transmute from "@transmute/verifiable-credentials"

interface RequestVerifyPresentation {
  issuerKey: string
  holderKey: string
  verifiablePresentation: string
  verification: string

  audience?: string
  nonce?: string
}

const getIssuerPublicKey = (argv: RequestVerifyPresentation) => {
  let holder = {} as Record<string, string>;
  if (argv.issuerKey) {
    const holderKey = fs.readFileSync(path.resolve(process.cwd(), argv.issuerKey))
    const publicKeyJwk = JSON.parse(holderKey.toString())
    holder = publicKeyJwk
  }
  return holder
}

const getHolderPublicKey = (argv: RequestVerifyPresentation) => {
  let holder = {} as Record<string, string>;
  if (argv.holderKey) {
    const holderKey = fs.readFileSync(path.resolve(process.cwd(), argv.holderKey))
    const publicKeyJwk = JSON.parse(holderKey.toString())
    holder = publicKeyJwk
  }
  return holder
}

const digester = {
  name: 'sha-256',
  digest: async (json: string) => {
    const content = new TextEncoder().encode(json);
    const digest = await crypto.createHash('sha256').update(content).digest();
    return base64url.encode(new Uint8Array(digest));
  }
}

const verify = async (argv: RequestVerifyPresentation) => {
  const issuerKey = getIssuerPublicKey(argv)
  const holderKey = getHolderPublicKey(argv)
  const verifiablePresentation = fs.readFileSync(path.resolve(process.cwd(), argv.verifiablePresentation)).toString()
  const audience = argv.audience;
  const nonce = argv.nonce;
  const verification = await transmute.vc.sd.verifier({
    resolver: {
      resolve: async (kid: string) => {
        if (kid === issuerKey.kid) {
          return issuerKey
        }
        if (kid === holderKey.kid) {
          return holderKey
        }
        throw new Error('Unsupported kid: ' + kid)
      }
    },
    digester
  })
    .verify({
      token: verifiablePresentation,
      audience,
      nonce
    })
  fs.writeFileSync(
    path.resolve(process.cwd(), argv.verification),
    Buffer.from(JSON.stringify(verification, null, 2))
  )
}

export default verify
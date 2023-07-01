import fs from "fs"
import path from "path"

import cose from "@transmute/cose"
import transmute from "@transmute/did-transmute"

interface RequestCoseSign {
  detached: boolean // defaults to true
  issuerKey: string // relative path to jwk
  input: string // path to input file
  output: string // path to output file
  didJwk: boolean // rewrite kid to use DIDs
}

const sign = async (argv: RequestCoseSign) => {
  const { issuerKey, input, output, didJwk } = argv
  const privateKeyJwk = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), issuerKey)).toString(),
  )
  const payload = fs.readFileSync(path.resolve(process.cwd(), input))
  const signer = await cose.detached.signer({ privateKeyJwk })
  const protectedHeader = { alg: privateKeyJwk.alg, kid: privateKeyJwk.kid }
  if (didJwk){
    const did = transmute.did.jwk.toDid(privateKeyJwk)
    protectedHeader.kid = did + '#0'
  }
  const unprotectedHeader = new Map()
  const {signature} = await signer.sign({
    protectedHeader,
    unprotectedHeader,
    payload
  })

  fs.writeFileSync(
    path.resolve(process.cwd(), output),
    Buffer.from(signature)
  )
}

export default sign
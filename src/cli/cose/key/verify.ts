import fs from "fs"
import path from "path"

import cose from "@transmute/cose"

interface RequestCoseVerify {
  detached: boolean // defaults to true
  verifierKey: string // relative path to jwk
  input: string // path to input file
  signature: string // path to signature file
  output: string // path to output file
}

const verify = async (argv: RequestCoseVerify) => {

  const { verifierKey, input, signature, output } = argv
  const publicKeyJwk = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), verifierKey)).toString(),
  )
  const payloadFromFile = fs.readFileSync(path.resolve(process.cwd(), input))
  const signatureFromFile = fs.readFileSync(path.resolve(process.cwd(), signature))

  const verifier = await cose.detached.verifier({ publicKeyJwk })
  const verified = await verifier.verify({
    payload: payloadFromFile,
    signature: signatureFromFile
  })
  const result = { verified }
  
  fs.writeFileSync(
    path.resolve(process.cwd(), output),
    JSON.stringify(
      result,
      null,
      2,
    ),
  )
}

export default verify
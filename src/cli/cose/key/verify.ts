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
  const payload = fs.readFileSync(path.resolve(process.cwd(), input))
  const detached = fs.readFileSync(path.resolve(process.cwd(), signature))
  const attached = cose.attachPayload({
    payload: payload,
    signature: detached
  })
  const verifier = await cose.verifier({ publicKeyJwk })
  let result = { verified: false}
  try {
    // TODO: https://github.com/transmute-industries/cose/issues/2
    const verified = await verifier.verify(attached)
    result = { verified: verified !== undefined}
  } catch(e){
    // 
  }
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
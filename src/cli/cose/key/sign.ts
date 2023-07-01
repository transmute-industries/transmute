import fs from "fs"
import path from "path"

import cose from "@transmute/cose"

interface RequestCoseSign {
  detached: boolean // defaults to true
  issuerKey: string // relative path to jwk
  input: string // path to input file
  output: string // path to output file
}

const sign = async (argv: RequestCoseSign) => {
  const { issuerKey, input, output } = argv
  const privateKeyJwk = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), issuerKey)).toString(),
  )
  const payload = fs.readFileSync(path.resolve(process.cwd(), input))
  const signer = await cose.detached.signer({ privateKeyJwk })
  const u = new Map()
  const {signature} = await signer.sign({
    protectedHeader: { alg: privateKeyJwk.alg },
    unprotectedHeader: u,
    payload
  })

  fs.writeFileSync(
    path.resolve(process.cwd(), output),
    Buffer.from(signature)
  )
}

export default sign
import fs from "fs"
import path from "path"

import cose from "@transmute/cose"


interface RequestCoseSign {
  detached: boolean // defaults to true
  issuerKey: string // relative path to jwk
  input: string // path to input file
  issuerKid?: string // kid
  output?: string // path to output file
  content_type?: string // media type
}

const sign = async (argv: RequestCoseSign) => {
  const { issuerKey, input, output, issuerKid, content_type } = argv
  const privateKeyJwk = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), issuerKey)).toString(),
  )
  const payload = fs.readFileSync(path.resolve(process.cwd(), input))
  const signer = await cose.detached.signer({ privateKeyJwk })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const protectedHeader: any = { alg: privateKeyJwk.alg, kid: privateKeyJwk.kid, }

  // set optional protected header
  if (issuerKid) {
    protectedHeader.kid = issuerKid
  }
  if (content_type) {
    protectedHeader.content_type = content_type
  }

  const unprotectedHeader = new Map()
  const { signature } = await signer.sign({
    protectedHeader,
    unprotectedHeader,
    payload
  })

  if (output) {
    fs.writeFileSync(
      path.resolve(process.cwd(), output),
      Buffer.from(signature)
    )
  } else {
    console.info('Signature Header: ')
    console.info(JSON.stringify(protectedHeader, null, 2))
  }

}

export default sign
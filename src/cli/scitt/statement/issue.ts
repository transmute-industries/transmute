import fs from "fs"
import path from "path"
import transmute from "@transmute/did-transmute"
import mime from 'mime'

import { default as detachedSign } from "../../cose/key/sign"

// scitt specific options
interface RequestSignedStatement {
  issuerKey: string // relative path to private key in jwk format
  statement: string // path to input file
  output?: string // path to output file
}

const issue = async (argv: RequestSignedStatement) => {
  const { issuerKey, statement, output } = argv
  const privateKeyJwk = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), issuerKey)).toString(),
  )
  const did = transmute.did.jwk.toDid(privateKeyJwk)
  const iss = did;
  const kid = did + '#0'
  const content_type = mime.getType(path.resolve(process.cwd(), statement))
  // map to normal cose....
  const detachedSignArgv = {
    issuerKey,
    input: statement,
    output,
    iss,
    kid,
    content_type,
    detached: true // always true for scitt?
  }
  return detachedSign(detachedSignArgv)

}

export default issue
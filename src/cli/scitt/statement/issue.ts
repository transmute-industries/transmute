import path from "path"
import mime from 'mime'

import { default as detachedSign } from "../../cose/key/sign"

interface RequestSignedStatement {
  issuerKey: string // relative path to private key in jwk format
  issuerKid: string // identifier for kid
  statement: string // path to input file
  signedStatement: string // path to output file
}

const issue = async (argv: RequestSignedStatement) => {
  const { issuerKey, issuerKid, statement, signedStatement } = argv
  const content_type = mime.getType(path.resolve(process.cwd(), statement))
  // map to normal cose
  return detachedSign({
    issuerKid,
    issuerKey,
    input: statement,
    output: signedStatement,
    content_type,
    detached: true
  })

}

export default issue
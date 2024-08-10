import fs from 'fs'
import path from 'path'
import mime from 'mime'

import cose from '@transmute/cose'

type RequestScittStatementIssue = {
  iss: string
  sub: string
  cty?: string
  issuerKey: string
  statement: string
  signedStatement: string
}

const issue = async (argv: RequestScittStatementIssue) => {
  const statement = fs.readFileSync(path.resolve(process.cwd(), argv.statement))
  const secretCoseKey = fs.readFileSync(path.resolve(process.cwd(), argv.issuerKey))
  const secretCoseKeyMap = cose.cbor.decode(secretCoseKey)
  const content_type = mime.getType(path.resolve(process.cwd(), argv.statement))
  console.warn('needs update')
  // const signedStatement = await cose.scitt.statement.issue({
  //   iss: argv.iss,
  //   sub: argv.sub,
  //   cty: argv.cty || content_type,
  //   payload: statement,
  //   secretCoseKey: secretCoseKeyMap
  // })
  // fs.writeFileSync(
  //   path.resolve(process.cwd(), argv.signedStatement),
  //   Buffer.from(signedStatement)
  // )
}

export default issue

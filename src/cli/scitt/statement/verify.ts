import fs from 'fs'
import path from 'path'

import cose from '@transmute/cose'

type RequestScittStatementVerify = {
  issuerKey: string
  statement: string
  signedStatement: string
  output?: string
}

const verify = async (argv: RequestScittStatementVerify) => {
  const publicCoseKey = fs.readFileSync(path.resolve(process.cwd(), argv.issuerKey))
  const publicCoseKeyMap = cose.cbor.decode(publicCoseKey)
  const statement = fs.readFileSync(path.resolve(process.cwd(), argv.statement))
  const signedStatement = fs.readFileSync(path.resolve(process.cwd(), argv.signedStatement))

  console.warn('needs update')

  // const verification = await cose.scitt.statement.verify({
  //   statement,
  //   signedStatement,
  //   publicCoseKey: publicCoseKeyMap
  // })

  // const result = JSON.stringify({ verification }, null, 2)

  // if (argv.output) {
  //   fs.writeFileSync(
  //     path.resolve(process.cwd(), argv.signedStatement),
  //     Buffer.from(result)
  //   )
  // } else {
  //   console.log(result)
  // }

}

export default verify

import fs from 'fs'
import path from 'path'

import cose from '@transmute/cose'

import { verifyX5C } from './verifyCertificateChain'

type RequestScittStatementVerifyX5C = {
  date?: string
  statement: string
  signedStatement: string
  output?: string
}

const verifyx5c = async (argv: RequestScittStatementVerifyX5C) => {

  const statement = fs.readFileSync(path.resolve(process.cwd(), argv.statement))
  const signedStatement = fs.readFileSync(path.resolve(process.cwd(), argv.signedStatement))

  const x5c = cose.scitt.statement.x5c(signedStatement)

  const discoveryTime = new Date(argv.date || new Date().toISOString())
  // check the certificate chain, produce verification keys
  const jwks = await verifyX5C('ES384', x5c, discoveryTime)

  const verifiedCertificatePublicKey = cose.key.importJWK(jwks.keys[0])
  const verification = await cose.scitt.statement.verify({
    statement,
    signedStatement: signedStatement,
    publicCoseKey: verifiedCertificatePublicKey
  })

  const result = JSON.stringify({ verification, jwks }, null, 2)

  if (argv.output) {
    fs.writeFileSync(
      path.resolve(process.cwd(), argv.signedStatement),
      Buffer.from(result)
    )
  } else {
    console.log(result)
  }

}

export default verifyx5c


import fs from "fs"
import path from "path"
import cose from "@transmute/cose"

interface RequestTransparencyVerify {
  statement: string
  transparentStatement: string
  issuerKey: string
  transparencyServiceKey: string
}

const verify = async (argv: RequestTransparencyVerify) => {

  const statement = fs.readFileSync(path.resolve(process.cwd(), argv.statement))
  const transparentStatement = fs.readFileSync(path.resolve(process.cwd(), argv.transparentStatement))
  const issuerKey = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), argv.issuerKey)).toString())
  const transparencyServiceKey = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), argv.transparencyServiceKey)).toString())

  const statementVerifier = await cose.detached.verifier({ publicKeyJwk: issuerKey })
  const isStatementVerified = await statementVerifier.verify({
    payload: statement,
    signature: transparentStatement
  })
  if (isStatementVerified) {
    console.log(`✅ verified: ${argv.statement}`)
  } else {
    console.log(`❌ verified: ${argv.statement}`)
  }

  const receiptVerifier = await cose.verifier({ publicKeyJwk: transparencyServiceKey })

  const transparentStatementUnprotectedHeader = cose.unprotectedHeader.get(transparentStatement)


  const [receipt] = transparentStatementUnprotectedHeader.get(cose.unprotectedHeader.receipt) as Buffer[]

  transparentStatementUnprotectedHeader.delete(cose.unprotectedHeader.receipt)
  const signedStatement = cose.unprotectedHeader.set(transparentStatement, transparentStatementUnprotectedHeader)

  const isRootVerified = await cose.merkle.verify_inclusion_proof({
    leaf: cose.merkle.leaf(signedStatement),
    signed_inclusion_proof: receipt,
    verifier: receiptVerifier
  })

  if (isRootVerified) {
    console.log(`✅ verified: ${argv.transparentStatement}`)
  } else {
    console.log(`❌ verified: ${argv.transparentStatement}`)
  }

}

export default verify
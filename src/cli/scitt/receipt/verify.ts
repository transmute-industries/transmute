
import fs from "fs"
import path from "path"
import cose from "@transmute/cose"

import getPublicKeyJwkFromKid from "../../../api/did/getPublicKeyJwkFromKid"


// scitt specific options
interface RequestVerifyReceipt {
  statement: string // path to input file
  transparentStatement: string // path to input file
}

const verify = async (argv: RequestVerifyReceipt) => {

  const statement = fs.readFileSync(path.resolve(process.cwd(), argv.statement))
  const transparentStatement = fs.readFileSync(path.resolve(process.cwd(), argv.transparentStatement))
  const transparentStatementUnprotectedHeader = cose.unprotectedHeader.get(transparentStatement)
  const receipt = transparentStatementUnprotectedHeader.get(cose.unprotectedHeader.receipt) as Buffer
  transparentStatementUnprotectedHeader.delete(cose.unprotectedHeader.receipt)
  const signedStatement = cose.unprotectedHeader.set(transparentStatement, transparentStatementUnprotectedHeader)
  try {
    const kid = cose.getKid(signedStatement)
    const publicKeyJwk = await getPublicKeyJwkFromKid(kid)

    const statementVerifier = await cose.detached.verifier({ publicKeyJwk })
    const isStatementVerified = (await statementVerifier).verify({
      payload: statement,
      signature: signedStatement
    })
    if (!isStatementVerified) {
      throw new Error('Failed to verify statement signature.')
    }
    console.info('🍃 Statement signature verified.')
    console.info('kid: ' + kid)

  } catch (e) {
    console.info('🔥 Statement could not be verified.')
  }

  try {
    const kid2 = cose.getKid(receipt)
    const publicKeyJwk2 = await getPublicKeyJwkFromKid(kid2)
    const receiptVerifier = await cose.verifier({ publicKeyJwk: publicKeyJwk2 })
    const verifiedRoot = await cose.merkle.verify_inclusion_proof({
      leaf: cose.merkle.leaf(signedStatement),
      signed_inclusion_proof: receipt,
      verifier: receiptVerifier
    })
    if (!verifiedRoot) {
      throw new Error('Failed to verify receipt')
    }
    console.info('🌿 Receipt verified.')
    console.info('kid: ' + kid2)

  } catch (e) {
    console.info('🔥 Statement could not be verified.')
  }

}

export default verify

import fs from "fs"
import path from "path"
import cose from "@transmute/cose"


interface RequestTransparentStatementVerify {
  statement: string
  transparentStatement: string
  issuerKey: string,
  transparencyServiceKey: string

}

const verify = async (argv: RequestTransparentStatementVerify) => {
  const statement = fs.readFileSync(path.resolve(process.cwd(), argv.statement))
  const transparentStatement = fs.readFileSync(path.resolve(process.cwd(), argv.transparentStatement))
  const issuerKey = cose.cbor.decode(fs.readFileSync(path.resolve(process.cwd(), argv.issuerKey)))
  const transparencyServiceKey = cose.cbor.decode(fs.readFileSync(path.resolve(process.cwd(), argv.transparencyServiceKey)))

  console.warn('needs update')
  // const verifiedIssuerSignedStatement = await cose.scitt.statement.verify({
  //   statement,
  //   signedStatement: transparentStatement,
  //   publicCoseKey: issuerKey
  // })

  // if (verifiedIssuerSignedStatement) {
  //   console.log(`✅ verified: ${argv.statement}`)
  // } else {
  //   console.log(`❌ verified: ${argv.statement}`)
  // }

  // const { entry, receipts } = await cose.scitt.statement.getEntryReceipts({ transparentStatement })
  // const [receipt] = receipts

  // const verifiedTransparentStatementReceipt = await cose.scitt.receipt.verify({
  //   entry,
  //   receipt: receipt,
  //   publicCoseKey: transparencyServiceKey
  // })

  // if (verifiedTransparentStatementReceipt) {
  //   console.log(`✅ verified: ${argv.transparentStatement}`)
  // } else {
  //   console.log(`❌ verified: ${argv.transparentStatement}`)
  // }

}

export default verify
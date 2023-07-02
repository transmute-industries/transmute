import fs from "fs"
import path from "path"

import cose from "@transmute/cose"


// scitt specific options
interface RequestAttachReceipt {
  signedStatement: string // path to signed statement
  receipt: string // path to signed inclusion proof
  transparentStatement: string // path to transparent statement
}

const attach = async (argv: RequestAttachReceipt) => {
  const signedStatement = fs.readFileSync(path.resolve(process.cwd(), argv.signedStatement))
  const receipt = fs.readFileSync(path.resolve(process.cwd(), argv.receipt))
  const signedStatementUnprotectedHeader = cose.unprotectedHeader.get(signedStatement)
  signedStatementUnprotectedHeader.set(300, receipt)
  const transparentStatement = cose.unprotectedHeader.set(signedStatement, signedStatementUnprotectedHeader)
  fs.writeFileSync(
    path.resolve(process.cwd(), argv.transparentStatement),
    Buffer.from(transparentStatement)
  )
}

export default attach
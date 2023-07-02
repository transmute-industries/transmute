import fs from "fs"
import path from "path"

import cose from "@transmute/cose"


interface RequestDetachReceipt {
  signedStatement: string // path to signed statement
  receipt: string // path to signed inclusion proof
  transparentStatement: string // path to transparent statement
}

const detach = async (argv: RequestDetachReceipt) => {
  const transparentStatement = fs.readFileSync(path.resolve(process.cwd(), argv.transparentStatement))
  const transparentStatementUnprotectedHeader = cose.unprotectedHeader.get(transparentStatement)
  const receipt = transparentStatementUnprotectedHeader.get(cose.unprotectedHeader.receipt) as Buffer
  transparentStatementUnprotectedHeader.delete(cose.unprotectedHeader.receipt)
  const signedStatement = cose.unprotectedHeader.set(transparentStatement, transparentStatementUnprotectedHeader)
  fs.writeFileSync(
    path.resolve(process.cwd(), argv.signedStatement),
    Buffer.from(signedStatement)
  )
  fs.writeFileSync(
    path.resolve(process.cwd(), argv.receipt),
    Buffer.from(receipt)
  )
}

export default detach
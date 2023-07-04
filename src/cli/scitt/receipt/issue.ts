
import fs from "fs"
import path from "path"
import axios from "axios"
import { base64url } from "jose"
import cose from "@transmute/cose"

interface RequestIssueReceipt {
  transparencyService: string // Base URL of a scitt transparency service api
  statement: string // path to statement
  signedStatement: string // path to signed statement
  transparentStatement: string // path to transparent statement
}

const issue = async (argv: RequestIssueReceipt) => {
  const statement = fs.readFileSync(path.resolve(process.cwd(), argv.statement))
  const signedStatement = fs.readFileSync(path.resolve(process.cwd(), argv.signedStatement))
  const registrationEndpoint = `${argv.transparencyService}/signed-statements`
  const response = await axios.post(registrationEndpoint, {
    'statement': base64url.encode(statement),
    'signed-statement': base64url.encode(signedStatement)
  }, {
    headers: {
      "Content-Type": 'application/json'
    }
  })
  console.log(response.status)
  console.log(response.data)
  const { proof } = response.data
  const receipt = base64url.decode(proof)
  const signedStatementUnprotectedHeader = cose.unprotectedHeader.get(signedStatement)
  signedStatementUnprotectedHeader.set(cose.unprotectedHeader.receipt, receipt)
  const transparentStatement = cose.unprotectedHeader.set(signedStatement, signedStatementUnprotectedHeader)
  fs.writeFileSync(
    path.resolve(process.cwd(), argv.transparentStatement),
    Buffer.from(transparentStatement)
  )

}

export default issue
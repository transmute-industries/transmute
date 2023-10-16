
import fs from "fs"
import path from "path"
import cose from "@transmute/cose"

import scitt from "../../../api/scitt"

interface RequestLedgerAppend {
  signedStatement: string
  ledger: string,
  issuerKey?: string
  transparentStatement?: string
}

const append = async (argv: RequestLedgerAppend) => {
  const signedStatement = fs.readFileSync(path.resolve(process.cwd(), argv.signedStatement))
  const ledgerPath = path.resolve(process.cwd(), argv.ledger)
  const ledger = await scitt.ledgers.sqlite(ledgerPath).create()
  const leaf = cose.binToHex(cose.merkle.leaf(signedStatement))
  const record = await ledger.append(leaf)

  if (!argv.issuerKey) {
    console.log('success.')
  } else {
    const jwkString = fs.readFileSync(path.resolve(process.cwd(), argv.issuerKey)).toString()
    const issuerPrivateKey = JSON.parse(jwkString)
    const leaves = await ledger.allLeaves()
    const receipt = await cose.merkle.inclusion_proof({
      alg: issuerPrivateKey.alg,
      kid: issuerPrivateKey.kid,
      leaf_index: record.id - 1,
      leaves: leaves.map(cose.hexToBin),
      signer: await cose.signer({ privateKeyJwk: issuerPrivateKey })
    })
    if (argv.transparentStatement) {
      const signedStatementUnprotectedHeader = cose.unprotectedHeader.get(signedStatement)
      // Tag 300 indicates receipts
      signedStatementUnprotectedHeader.set(300, [cose.utils.typedArrayToBuffer(receipt)])
      const transparentStatement = cose.unprotectedHeader.set(signedStatement, signedStatementUnprotectedHeader)
      const outputPath = path.resolve(process.cwd(), argv.transparentStatement)
      fs.writeFileSync(outputPath, transparentStatement)
      const items = await cose.rfc.diag(transparentStatement)
      console.log(await cose.rfc.blocks(items))
    } else {
      const items = await cose.rfc.diag(receipt)
      console.log(await cose.rfc.blocks(items))
    }
  }
}

export default append
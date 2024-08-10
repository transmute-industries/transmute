
import fs from "fs"
import path from "path"
import cose from "@transmute/cose"

import scitt from "../../../../api/scitt"

interface RequestLedgerAppend {
  iss: string
  sub: string
  signedStatement: string
  ledger: string,
  issuerKey?: string
  transparentStatement?: string
}

const issue = async (argv: RequestLedgerAppend) => {
  const signedStatement = fs.readFileSync(path.resolve(process.cwd(), argv.signedStatement))
  const ledgerPath = path.resolve(process.cwd(), argv.ledger)
  const ledger = await scitt.ledgers.jsonFile(ledgerPath).create()
  console.warn('needs update')
  // const leaf = cose.binToHex(cose.merkle.leaf(signedStatement))
  // const record = await ledger.append(leaf)
  // if (!argv.issuerKey) {
  //   console.log('success.', record)
  // } else {
  //   const issuerPrivateKey = fs.readFileSync(path.resolve(process.cwd(), argv.issuerKey))
  //   const issuerPrivateKeyMap = cose.cbor.decode(issuerPrivateKey)
  //   const leaves = await ledger.allLeaves()
  //   const receipt = await cose.scitt.receipt.issue({
  //     iss: argv.iss,
  //     sub: argv.sub,
  //     index: record.id,
  //     leaves: leaves.map(cose.hexToBin),
  //     secretCoseKey: issuerPrivateKeyMap
  //   })
  //   if (argv.transparentStatement) {
  //     const transparentStatement = cose.scitt.statement.addReceipt({
  //       statement: signedStatement,
  //       receipt
  //     })
  //     const outputPath = path.resolve(process.cwd(), argv.transparentStatement)
  //     fs.writeFileSync(outputPath, transparentStatement)
  //     const items = await cose.rfc.diag(transparentStatement)
  //     console.log(await cose.rfc.blocks(items))
  //   } else {
  //     const items = await cose.rfc.diag(Buffer.from(receipt))
  //     console.log(await cose.rfc.blocks(items))
  //   }
  // }
}

export default issue
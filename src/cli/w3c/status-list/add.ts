
import fs from "fs"
import path from "path"

/*
npm run transmute -- w3c status-list add \
--id https://example.com/credentials/status/3 \
--type StatusList2021Entry \
--purpose revocation \
--index 22222 \
--claimset examples/w3c/status-list/credential-with-status.claimset.json
*/

interface RequestAddStatusList {
  id: string
  type: string
  purpose: string
  index: string
  claimset: string // input and output path
}

const add = async (argv: RequestAddStatusList) => {
  const claimset = fs.readFileSync(path.resolve(process.cwd(), argv.claimset))
  const vc = JSON.parse(claimset.toString())
  const status = {
    id: `${argv.id}#${argv.index}`,
    type: `${argv.type}`,
    statusPurpose: `${argv.purpose}`,
    statusListIndex: `${argv.index}`,
    statusListCredential: `${argv.id}`
  }
  if (vc.credentialStatus) {
    const existing = Array.isArray(vc.credentialStatus) ? vc.credentialStatus : [vc.credentialStatus]
    const included = existing.findIndex((cs) => {
      return cs.statusListCredential === argv.id
    })
    if (included > -1) {
      existing[included] = status
    } else {
      existing.push(status)
    }
    vc.credentialStatus = existing
  } else {
    vc.credentialStatus = status
  }
  fs.writeFileSync(
    path.resolve(process.cwd(), argv.claimset),
    Buffer.from(JSON.stringify(vc, null, 2))
  )
}

export default add
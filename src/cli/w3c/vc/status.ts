
import fs from "fs"
import path from "path"
import axios from "axios"

interface RequestCredentialStatusUpdate {
  verification: string
  revocation?: string
  suspension?: string
  verifiableCredential?: string
}

const status = async (argv: RequestCredentialStatusUpdate) => {
  const verification = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), argv.verification)).toString())
  const statusLists = Array.isArray(verification.claimset.credentialStatus) ?
    verification.claimset.credentialStatus : [verification.claimset.credentialStatus]
  const purpose = argv.revocation !== undefined ? 'revocation' : 'suspension'
  const statusList = statusLists.find((sl) => {
    return sl.statusPurpose === purpose
  })
  const { statusListIndex, statusListCredential } = statusList

  const response = await axios.patch(statusListCredential, {
    position: parseInt(statusListIndex, 10),
    value: (argv[purpose] as string) === 'true' ? 1 : 0
  })
  const { data } = response
  const vc = data
  if (argv.verifiableCredential) {
    fs.writeFileSync(
      path.resolve(process.cwd(), argv.verifiableCredential),
      Buffer.from(vc)
    )
  } else {
    console.log(vc)
  }
}

export default status
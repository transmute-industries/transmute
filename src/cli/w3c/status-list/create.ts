
import fs from "fs"
import path from "path"
import transmute from "@transmute/did-transmute"

/*
npm run transmute -- w3c status-list create \
--id https://example.com/credentials/status/3 \
--issuer https://key.transparency/issuer/42 \
--valid-from 2019-05-25T03:10:16.992Z \
--purpose revocation \
--length 8 \
--claimset examples/w3c/status-list/claimset.json
*/

interface RequestCreateStatusList {
  id: string
  issuer: string
  validFrom: string
  purpose: string
  length: string
  claimset: string // output path
}

const create = async (argv: RequestCreateStatusList) => {
  const claimset = await transmute.w3c.vc.StatusList.create({
    id: argv.id,
    length: parseInt(argv.length, 10),
    purpose: argv.purpose
  })
  claimset.issuer = argv.issuer
  claimset.validFrom = argv.validFrom
  fs.writeFileSync(
    path.resolve(process.cwd(), argv.claimset),
    Buffer.from(JSON.stringify(claimset, null, 2))
  )
}

export default create
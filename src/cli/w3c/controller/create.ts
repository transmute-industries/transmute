
import fs from "fs"
import path from "path"
import transmute from "@transmute/did-transmute"

/*
npm run transmute -- w3c controller create \
--issuer-key examples/w3c/status-list/public.verifying.jwk.json \
--controller examples/w3c/status-list/did.json
*/

interface RequestCreateController {
  issuerKey: string
  controller: string // output 
}

const create = async (argv: RequestCreateController) => {
  const issuerKey = fs.readFileSync(path.resolve(process.cwd(), argv.issuerKey))
  const publicKey = JSON.parse(issuerKey.toString())
  const document = await transmute.w3c.controller.did.document.create(publicKey)
  fs.writeFileSync(
    path.resolve(process.cwd(), argv.controller),
    Buffer.from(JSON.stringify(document, null, 2))
  )
}

export default create
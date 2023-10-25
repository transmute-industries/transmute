import fs from "fs"
import path from "path"

import * as jose from 'jose'
import transmute from "@transmute/did-transmute"

/* 

npm run transmute -- scitt certificate controller \
--subject-did did:web:issuer.key.transparency.example \
--subject-public-key examples/scitt/user.public.jwk.json \
--controller examples/scitt/user.did.json

*/

interface RequestCertificateController {
  subjectDid: string
  subjectPublicKey: string
  controller: string
}


const identifier = {
  replace: (doc, source, target) => {
    return JSON.parse(
      JSON.stringify(doc, function replacer(key, value) {
        if (value === source) {
          return target
        }
        return value
      }),
    )
  },
}


const controller = async (argv: RequestCertificateController) => {
  const subjectKey = fs.readFileSync(path.resolve(process.cwd(), argv.subjectPublicKey))
  const publicKey = JSON.parse(subjectKey.toString())
  const document = await transmute.w3c.controller.did.document.create(publicKey)
  const doc = identifier.replace(document, document.id, argv.subjectDid)
  fs.writeFileSync(
    path.resolve(process.cwd(), argv.controller),
    Buffer.from(JSON.stringify(doc, null, 2))
  )
}

export default controller

import fs from "fs"
import path from "path"
import transmute from "@transmute/did-transmute"
import { decodeProtectedHeader } from "jose"
import axios from "axios"

// without resolver
/*
npm run transmute -- w3c presentation verify \
--issuer-key examples/w3c/public.verifying.jwk.json \
--verifiable-presentation examples/w3c/vc.jwt \
--output examples/w3c/vc.jwt.verified.json
*/

// with resolver
/*
npm run transmute -- w3c presentation verify \
--did-resolver https://transmute.id/api \
--verifiable-presentation examples/w3c/vc.jwt \
--output examples/w3c/vc.jwt.verified.json
*/

interface RequestVerifyVerifiablePresentation {
  holderKey: string
  verifiablePresentation: string
  output: string
  didResolver: string
}

const verify = async (argv: RequestVerifyVerifiablePresentation) => {
  const vp = fs.readFileSync(path.resolve(process.cwd(), argv.verifiablePresentation))
  const verifier = await transmute.w3c.vp.verifier({
    holder: async (vp: string) => {
      if (argv.holderKey) {
        const holderKey = fs.readFileSync(path.resolve(process.cwd(), argv.holderKey))
        const publicKey = JSON.parse(holderKey.toString())
        return publicKey
      }
      const { kid } = decodeProtectedHeader(vp)
      // messy resolution logic due to resolution and dereferencing not being defined by W3C.
      const response = await axios.get(argv.didResolver + '/' + kid, {
        headers: {
          "Content-Type": 'application/did+json'
        }
      })
      const didDocument = response.data.didDocument ? response.data.didDocument : response.data
      const { publicKeyJwk } = didDocument.verificationMethod.find((vm) => {
        return kid?.endsWith(vm.id)
      })
      return publicKeyJwk
    }
  })
  let result = '';
  try {
    const verified = await verifier.verify(vp.toString())
    result = JSON.stringify(verified, null, 2)
  } catch (e) {
    result = JSON.stringify({ error: (e as Error).message }, null, 2)
  }
  if (!argv.output) {
    console.log(result)
  } else {
    fs.writeFileSync(
      path.resolve(process.cwd(), argv.output),
      Buffer.from(result)
    )
  }
}

export default verify

import fs from "fs"
import path from "path"
import transmute from "@transmute/did-transmute"
import { decodeProtectedHeader } from "jose"
import axios from "axios"


interface RequestValidateVerifiableCredential {
  issuerKey: string
  verifiableCredential: string
  output: string
  didResolver: string
}

const validate = async (argv: RequestValidateVerifiableCredential) => {
  const vc = fs.readFileSync(path.resolve(process.cwd(), argv.verifiableCredential))

  const verifier = await transmute.w3c.vc.verifier({
    issuer: async (vc: string) => {
      if (argv.issuerKey) {
        const issuerKey = fs.readFileSync(path.resolve(process.cwd(), argv.issuerKey))
        const publicKey = JSON.parse(issuerKey.toString())
        return publicKey
      }
      const { kid } = decodeProtectedHeader(vc)
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

  const validator = await transmute.w3c.vc.validator({
    vc: vc.toString(),
    issuer: async (vc: string) => {
      if (argv.issuerKey) {
        const issuerKey = fs.readFileSync(path.resolve(process.cwd(), argv.issuerKey))
        const publicKey = JSON.parse(issuerKey.toString())
        return publicKey
      }
      const { kid } = decodeProtectedHeader(vc)
      // messy resolution logic due to resolution and dereferencing not being defined by W3C.
      const response = await axios.get(argv.didResolver + '/' + kid, {
        headers: {
          "Accept": 'application/did+json'
        }
      })
      const didDocument = response.data.didDocument ? response.data.didDocument : response.data
      const { publicKeyJwk } = didDocument.verificationMethod.find((vm) => {
        return kid?.endsWith(vm.id)
      })
      return publicKeyJwk
    },
    credentialStatus: async (id: string) => {
      const response = await axios.get(id, {
        headers: {
          "Accept": 'application/vc+ld+jwt'
        }
      })
      return response.data
    },
    credentialSchema: async (id: string) => {
      const response = await axios.get(id, {
        headers: {
          "Accept": 'application/schema+json'
        }
      })
      return response.data
    }
  })
  let result = '';
  try {
    const verified = await verifier.verify(vc.toString())
    const validation = await validator.validate(verified)
    result = JSON.stringify(validation, null, 2)
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

export default validate

import fs from "fs"
import path from "path"
import axios from "axios"
import yaml from "yaml"
import { decodeProtectedHeader } from 'jose'
import transmute from "@transmute/verifiable-credentials"

interface RequestValidateValidation {
  verification: string
  transparencyService: string
  output?: string
}

const dereference = (controller: any, kid: string) => {
  const jwks = (controller.verificationMethod || []).map((vm) => {
    return vm.publicKeyJwk
  })
  const jwk = jwks.find((k) => {
    return kid.endsWith(k.kid)
  })
  return jwk
}

const validate = async (argv: RequestValidateValidation) => {
  const validator = await transmute.vc.validator({
    issuer: async (token: string) => {
      // this resolver MUST return application/jwk+json (as an object)
      const parsed = transmute.vc.sd.Parse.compact(token)
      const header = decodeProtectedHeader(parsed.jwt)
      const { kid } = header
      if (!kid) {
        console.log('kid is required in status list credentials.')
        process.exit(0)
      } else {
        const controllerDocument = `${argv.transparencyService}/issuers/${kid}`
        const response = await axios.get(controllerDocument)
        const { data } = response

        const jwk = dereference(data, kid);
        if (jwk) {
          return jwk
        } else {
          console.log('could not discover verification key to validate extensions')
          process.exit(0)
        }
      }
    },
    credentialStatus: async (id: string) => {
      // this resolver MUST return application/vc+ld+json+sd-jwt (as a string)
      const response = await axios.get(id)
      const { data } = response
      return data
    },
    credentialSchema: async (id: string) => {
      // this resolver MUST return application/schema+json (as an object)
      const response = await axios.get(id)
      const { data } = response
      if (response.headers['content-type'].includes('yaml')) {
        return JSON.parse(JSON.stringify(yaml.parse(data)))
      } else {
        return data
      }

    }
  })

  const verification = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), argv.verification)).toString())
  const validation = await validator.validate(verification)

  if (argv.output) {
    fs.writeFileSync(
      path.resolve(process.cwd(), argv.output),
      Buffer.from(JSON.stringify(validation, null, 2))
    )
  } else {
    console.log(JSON.stringify(validation, null, 2))
  }
}

export default validate
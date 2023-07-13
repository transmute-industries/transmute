import fs from "fs"
import path from "path"
import axios from "axios"
import cose from "@transmute/cose"

interface RequestCoseVerify {
  input: string // path to input file
  signature: string // path to signature file
  output?: string // path to output file
  verifierKey?: string // relative path to jwk
  didResolver: string
}

const verify = async (argv: RequestCoseVerify) => {

  const { verifierKey, input, signature, output } = argv

  const payloadFromFile = fs.readFileSync(path.resolve(process.cwd(), input))
  const signatureFromFile = fs.readFileSync(path.resolve(process.cwd(), signature))

  let publicKeyJwk;

  if (verifierKey) {
    publicKeyJwk = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), verifierKey)).toString(),
    )
  } else {
    const kid = cose.getKid(signatureFromFile)
    const response = await axios.get(argv.didResolver + '/' + kid, {
      headers: {
        "Content-Type": 'application/did+json'
      }
    })
    const didDocument = response.data.didDocument ? response.data.didDocument : response.data
    const vm = didDocument.verificationMethod.find((vm) => {
      return kid?.endsWith(vm.id)
    })
    publicKeyJwk = vm.publicKeyJwk
  }

  const verifier = await cose.detached.verifier({ publicKeyJwk })
  const verified = await verifier.verify({
    payload: payloadFromFile,
    signature: signatureFromFile
  })

  const result = { verified }

  if (output) {
    fs.writeFileSync(
      path.resolve(process.cwd(), output),
      JSON.stringify(
        result,
        null,
        2,
      ),
    )
  } else {
    console.info(result)
  }

}

export default verify
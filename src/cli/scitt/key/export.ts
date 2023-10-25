import fs from 'fs'
import path from 'path'

import cose from '@transmute/cose'

type RequestCoseKeyGenerate = {
  input: string
  output: string
}

const exportKey = async (argv: RequestCoseKeyGenerate) => {
  const coseKey = fs.readFileSync(path.resolve(process.cwd(), argv.input))
  const coseKeyMap = cose.cbor.decode(coseKey)
  const publicKeyMap = cose.key.utils.publicFromPrivate(coseKeyMap)
  const publicKey = cose.cbor.encode(publicKeyMap)

  fs.writeFileSync(
    path.resolve(process.cwd(), argv.output),
    Buffer.from(publicKey)
  )
}

export default exportKey

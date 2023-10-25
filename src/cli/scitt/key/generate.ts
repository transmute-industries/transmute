import fs from 'fs'
import path from 'path'

import cose from '@transmute/cose'

type RequestCoseKeyGenerate = {
  alg: string
  output: string
}

const generate = async (argv: RequestCoseKeyGenerate) => {
  const cosePrivateKeyMap = await cose.key.generate(parseInt(argv.alg, 10))
  const coseKeyThumbprint = await cose.key.thumbprint.calculateCoseKeyThumbprint(cosePrivateKeyMap)
  cosePrivateKeyMap.set(2, coseKeyThumbprint)
  const coseKey = cose.cbor.encode(cosePrivateKeyMap)
  fs.writeFileSync(
    path.resolve(process.cwd(), argv.output),
    Buffer.from(coseKey)
  )
}

export default generate
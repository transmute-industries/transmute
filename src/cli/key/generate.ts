import fs from 'fs'
import path from 'path'

import key from '../../api/jose/key'

const generateKey = async ({ crv, alg, output }) => {
  const privateKeyJwk = await key.generate({ crv, alg })
  const content = JSON.stringify(privateKeyJwk, null, 2)
  const outputPath = path.resolve(process.cwd(), output)
  fs.writeFileSync(outputPath, content)
}

export default generateKey

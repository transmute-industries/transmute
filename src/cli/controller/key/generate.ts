import fs from 'fs'
import path from 'path'

import controller from '../../../api/controller'

const generateKey = async ({ crv, alg, output }) => {
  const { privateKeyJwk } = await controller.key.generate({ crv, alg })
  const content = JSON.stringify(privateKeyJwk, null, 2)
  const outputPath = path.resolve(process.cwd(), output)
  fs.writeFileSync(outputPath, content)
}

export default generateKey

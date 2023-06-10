import fs from 'fs'
import path from 'path'

import controller from '../../../api/controller'

const exportKey = ({ input, output }) => {
  const jwk = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), input)).toString(),
  )
  const content = JSON.stringify(controller.key.publicFromPrivate(jwk), null, 2)
  const outputPath = path.resolve(process.cwd(), output)
  fs.writeFileSync(outputPath, content)
}

export default exportKey

import fs from 'fs'
import path from 'path'

import key from '../../api/jose/key'

const exportKey = ({ input, output }) => {
  const jwk = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), input)).toString(),
  )
  const content = JSON.stringify(key.publicFromPrivate(jwk), null, 2)
  const outputPath = path.resolve(process.cwd(), output)
  fs.writeFileSync(outputPath, content)
}

export default exportKey

import fs from 'fs'
import path from 'path'

import mime from 'mime'
import key from '../../api/jose/key'

const signWithKey = async ({ issuerKey, input, output }) => {
  const privateKeyJwk = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), issuerKey)).toString(),
  )
  const content = fs.readFileSync(path.resolve(process.cwd(), input))
  const cty = mime.getType(path.resolve(process.cwd(), input))
  const signer = await key.detached.signer(privateKeyJwk)
  const detached = await signer.sign(content, { cty })
  fs.writeFileSync(
    path.resolve(process.cwd(), output),
    JSON.stringify(
      { protected: detached.protected, signature: detached.signature },
      null,
      2,
    ),
  )
}

export default signWithKey

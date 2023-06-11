import fs from 'fs'
import path from 'path'

import key from '../../api/jose/key'

const verifyWithKey = async ({ verifierKey, input, signature, output }) => {
  const publicKeyJwk = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), verifierKey)).toString(),
  )
  const content = fs.readFileSync(path.resolve(process.cwd(), input))
  const detached = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), signature)).toString(),
  )
  const verifier = await key.detached.verifier(publicKeyJwk)
  const { protectedHeader } = await verifier.verify({
    ...detached,
    payload: content,
  })
  fs.writeFileSync(
    path.resolve(process.cwd(), output),
    JSON.stringify({ verified: true, protectedHeader }, null, 2),
  )
}

export default verifyWithKey

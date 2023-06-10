import fs from 'fs'
import path from 'path'

import controller from '../../../api/controller'

const encryptToKey = async ({ recipient, input, output }) => {
  const recipientPublicKey = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), recipient)).toString(),
  )
  const recipientContent = fs.readFileSync(path.resolve(process.cwd(), input))
  const jwe = await controller.key.encryptToKey({
    publicKey: recipientPublicKey,
    plaintext: recipientContent,
  })
  fs.writeFileSync(
    path.resolve(process.cwd(), output),
    JSON.stringify(jwe, null, 2),
  )
}

export default encryptToKey

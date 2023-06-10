import fs from 'fs'
import path from 'path'

import controller from '../../../api/controller'

const decryptWithKey = async ({ recipient, input, output }) => {
  const recipientPrivateKey = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), recipient)).toString(),
  )
  const recipientCipherText = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), input)).toString(),
  )
  const decrypted = await controller.key.decryptWithKey({
    privateKey: recipientPrivateKey,
    ciphertext: recipientCipherText,
  })
  fs.writeFileSync(
    path.resolve(process.cwd(), output),
    decrypted.plaintext,
  )
}

export default decryptWithKey

import fs from 'fs'
import path from 'path'

import key from '../../api/jose/key'

const encryptToKey = async ({ recipient, input, output }) => {
  const recipientPublicKey = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), recipient)).toString(),
  )
  const recipientContent = fs.readFileSync(path.resolve(process.cwd(), input))
  const jwe = await key.recipient.encrypt({
    publicKey: recipientPublicKey,
    plaintext: recipientContent,
  })
  fs.writeFileSync(
    path.resolve(process.cwd(), output),
    JSON.stringify(jwe, null, 2),
  )
}

export default encryptToKey

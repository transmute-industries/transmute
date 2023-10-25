import fs from 'fs'
import path from 'path'

import cose from '@transmute/cose'

type RequestCoseKeyDiagnose = {
  input: string
  output: string
}

const diagnose = async (argv: RequestCoseKeyDiagnose) => {
  const someCoseMessage = fs.readFileSync(path.resolve(process.cwd(), argv.input))
  const items = await cose.rfc.diag(someCoseMessage)
  const diag = cose.rfc.blocks(items)
  const final = argv.output.endsWith('.md') ? diag : items.join('\n\n')
  fs.writeFileSync(
    path.resolve(process.cwd(), argv.output),
    Buffer.from(final)
  )
}

export default diagnose

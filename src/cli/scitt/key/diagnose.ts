import fs from 'fs'
import path from 'path'

import cose from '@transmute/cose'

type RequestCoseKeyDiagnose = {
  input: string
  output: string
}

const diagnose = async (argv: RequestCoseKeyDiagnose) => {
  const coseKey = fs.readFileSync(path.resolve(process.cwd(), argv.input))
  const coseKeyMap = cose.cbor.decode(coseKey)
  const diag = cose.key.edn(coseKeyMap)
  const final = argv.output.endsWith('.md') ? `
~~~~ cbor-diag
${diag}
~~~~
  `.trim() : diag
  fs.writeFileSync(
    path.resolve(process.cwd(), argv.output),
    Buffer.from(final)
  )
}

export default diagnose

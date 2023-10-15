import fs from "fs"
import path from "path"

import cose from "@transmute/cose"


interface RequestDiagnose {
  input: string // path to input file
  output?: string // path to output file
}

const diagnose = async (argv: RequestDiagnose) => {
  const { input, output } = argv

  const payload = fs.readFileSync(path.resolve(process.cwd(), input))
  const result = await cose.rfc.diag(payload)
  if (output) {
    fs.writeFileSync(
      path.resolve(process.cwd(), output),
      result
    )
  } else {

    console.info(result)
  }

}

export default diagnose
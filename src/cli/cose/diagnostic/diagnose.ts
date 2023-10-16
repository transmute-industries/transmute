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
  const items = await cose.rfc.diag(payload)
  const markdown = await cose.rfc.blocks(items)
  if (output) {
    fs.writeFileSync(
      path.resolve(process.cwd(), output),
      markdown
    )
  } else {

    console.info(markdown)
  }

}

export default diagnose
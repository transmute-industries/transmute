import fs from "fs"
import path from "path"

interface RequestDiagnose {
  input: string // path to input file
  output?: string // path to output file
}

const generate = async (argv: RequestDiagnose) => {
  // const { input, output } = argv

  // const payload = fs.readFileSync(path.resolve(process.cwd(), input))
  // // TODO: use @transmute/edn
  // const edn = await cose.cbor.diagnose(payload)
  // if (output) {
  //   fs.writeFileSync(
  //     path.resolve(process.cwd(), output),
  //     edn
  //   )
  // } else {
  //   console.info(edn)
  // }
  console.log('todo jose key generate')

}

export default generate
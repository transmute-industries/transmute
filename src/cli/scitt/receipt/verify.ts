
// scitt specific options
interface RequestVerifyReceipt {
  issuerKey: string // relative path to private key in jwk format
  input: string // path to input file
  output: string // path to output file
}

const verify = async (argv: RequestVerifyReceipt) => {
  const { issuerKey, input, output } = argv
  console.error('Not implemented')

}

export default verify
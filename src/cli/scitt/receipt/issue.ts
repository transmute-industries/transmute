
// scitt specific options
interface RequestReceipt {
  issuerKey: string // relative path to private key in jwk format
  input: string // path to input file
  output: string // path to output file
}

const issue = async (argv: RequestReceipt) => {
  const { issuerKey, input, output } = argv
  console.error('Not implemented')

}

export default issue
import { default as detachedVerify } from '../../cose/key/verify'
// scitt specific options
interface RequestVerifySignedStatement {
  detached: boolean // defaults to true
  verifierKey?: string // relative path to jwk
  input: string // path to input file
  signature: string // path to signature file
  output: string // path to output file
}

const verify = async (argv: RequestVerifySignedStatement) => {
  const { verifierKey, input, signature, output } = argv
  // map to normal cose
  return detachedVerify(argv)
}

export default verify
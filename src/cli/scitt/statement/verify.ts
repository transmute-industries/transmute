import { default as detachedVerify } from '../../cose/key/verify'
// scitt specific options
interface RequestVerifySignedStatement {
  detached: boolean // defaults to true
  verifierKey?: string // relative path to jwk
  statement: string // path to input file
  signedStatement: string // path to signature file
  output: string // path to output file
}

const verify = async (argv: RequestVerifySignedStatement) => {
  const { verifierKey, output } = argv
  // map to normal cose
  return detachedVerify({
    verifierKey,
    input: argv.statement,
    signature: argv.signedStatement,
    output,
    detached: true
  })
}

export default verify
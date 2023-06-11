import fs from 'fs'
import path from 'path'

import vcdm from '../../api/vcdm'

const actions = {
  create: async (argv) => {
    const { input, key, output } = argv
    const privateKeyJwk = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), key)).toString(),
    )
    const claimset = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), input)).toString(),
    )
    const signer = await vcdm.vc.signer(privateKeyJwk)
    const signed = await signer.sign(claimset)
    fs.writeFileSync(
      path.resolve(process.cwd(), output),
      JSON.stringify(signed, null, 2),
    )
  },
  verify: async (argv) => {
    const { input, key, output } = argv
    const publicKeyJwk = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), key)).toString(),
    )
    const claimset = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), input)).toString(),
    )
    const verifier = await vcdm.vc.verifier(publicKeyJwk)
    const verified = await verifier.verify(claimset)
    fs.writeFileSync(
      path.resolve(process.cwd(), output),
      JSON.stringify(verified, null, 2),
    )
  },
}

const register = (yargs) => {
  yargs.command(
    'credential [action]',
    'credential operations',
    {
      input: {
        alias: 'i',
        description: 'Path to input document',
        demandOption: true,
      },
      output: {
        alias: 'o',
        description: 'Path to output document',
        demandOption: true,
      },
      key: {
        alias: 'k',
        description: 'Path to key',
      },
    },
    async (argv) => {
      const { action } = argv
      if (actions[action]) {
        await actions[action](argv)
      }
    },
  )
}
const credential = { register }
export default credential

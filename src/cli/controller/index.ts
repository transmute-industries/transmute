import fs from 'fs'
import path from 'path'

import controller from '../../api/controller'

const actions = {
  create: async (argv) => {
    const { input, output, accept } = argv
    const publicKeyJwk = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), input)).toString(),
    )
    let did = await controller.did.document.create(publicKeyJwk)
    if (accept === 'application/did+json'){
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (did as any)['@context'];
      did = controller.did.document.identifier.replace(did, did.id, publicKeyJwk.kid)
      did = controller.did.document.identifier.replace(did, '#0', publicKeyJwk.kid)
    }
    fs.writeFileSync(
      path.resolve(process.cwd(), output),
      JSON.stringify(did, null, 2),
    )
  },
}

const register = (yargs) => {
  yargs.command(
    'controller [action]',
    'controller operations',
    {
      input: {
        alias: 'i',
        description: 'Path to input',
      },
      output: {
        alias: 'o',
        description: 'Path to output',
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
const graph = { register }
export default graph

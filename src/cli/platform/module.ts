import VerifiableDataPlatform from '@transmute/sdk'
import operationSwitch from '../../operationSwitch'

export const command = 'platform <resource> <action>'

export const describe = 'platform operations'

export const builder = (yargs) => {
  return yargs
    .positional('resource', {
      describe: 'The platform resource',
      type: 'string',
    })
    .positional('action', {
      describe: 'The operation on the platform resource',
      type: 'string',
    })
    .option('env', {
      alias: 'e',
      description: 'Relative path to .env',
      demandOption: true,
    })
    .option('input', {
      alias: 'i',
      description: 'File path as input',
    })
    .option('output', {
      alias: 'o',
      description: 'File path as output',
    })
    .option('sent', {
      description: 'Filter to only sent items',
    })
    .option('received', {
      description: 'Filter to only received items',
    })
    .option('push-neo4j', {
      description: 'Push to Neo4j',
    })
}

interface PlatformArgv {
  api: VerifiableDataPlatform
  received?: boolean
  sent?: boolean
  pushNeo4j?: boolean
}

const resources = {
  presentations: {
    list: async (argv: PlatformArgv) => {
      const { api, received, sent, pushNeo4j } = argv
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const results: any = { items: [] }
      if (received) {
        const response = await api.presentations.getPresentationsSharedWithMe()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = response.data as any
        if (response.data) {
          results.page = data.page
          results.count = data.count
          results.items = [
            ...results.items,
            ...data.items.map((p) => {
              return p.verifiablePresentation
            }),
          ]
        }
      }
      if (sent) {
        const response = await api.presentations.getPresentationsSharedWithOthers()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = response.data as any
        if (response.data) {
          results.page = data.page
          results.count = data.count
          results.items = [
            ...results.items,
            ...data.items.map((p) => {
              return p.verifiablePresentation
            }),
          ]
        }
        // in case both are passed, these values don't make sense...
        if (received) {
          delete results.page
          delete results.count
        }
      }
      if (!pushNeo4j) {
        console.info(JSON.stringify(results, null, 2))
      } else {
        const verifiablePresentations = results.items
        // if this is too much, we will need to import each vc one by one.
        for (const verifiablePresentation of verifiablePresentations) {
          try {
            const options = {
              json: JSON.stringify({ jwt: verifiablePresentation }),
              neo4jUri: process.env.NEO4J_URI || '',
              neo4jUser: process.env.NEO4J_USERNAME || '',
              neo4jPassword: process.env.NEO4J_PASSWORD || '',
            }
            const result = await operationSwitch(options)
            console.info(JSON.stringify(result, null, 2))
          } catch (e) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            console.info(JSON.stringify({ error: (e as any).message }, null, 2))
          }
        }
      }
    },
  },
}
export const handler = async function (argv) {
  const { resource, action, env } = argv
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config({ path: env })
  const api = await VerifiableDataPlatform.fromEnv({
    CLIENT_ID: process.env.CLIENT_ID as string,
    CLIENT_SECRET: process.env.CLIENT_SECRET as string,
    API_BASE_URL: process.env.API_BASE_URL as string,
    TOKEN_AUDIENCE: process.env.TOKEN_AUDIENCE as string,
  })
  argv.api = api
  if (resources[resource][action]) {
    resources[resource][action](argv)
  }
}

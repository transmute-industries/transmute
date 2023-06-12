import VerifiableDataPlatform from '@transmute/sdk'
import * as uuid from 'uuid'
import operationSwitch from '../../operationSwitch'

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

      const verifiablePresentations = results.items
      const holder = process.env.API_BASE_URL as string
      const multiPresentationSupport = {
        '@context': {'@vocab': 'https://www.w3.org/2018/credentials#'},
        type: ['VerifiablePresentation'],
        id: `urn:uuid:${uuid.v4()}`,
        holder: holder,
        verifiableCredential: verifiablePresentations,
      }
      if (!pushNeo4j) {
        console.log(JSON.stringify(multiPresentationSupport, null, 2))
      } else {
        try {
          const options = {
            json: JSON.stringify(multiPresentationSupport),
            neo4jUri: process.env.NEO4J_URI || '',
            neo4jUser: process.env.NEO4J_USERNAME || '',
            neo4jPassword: process.env.NEO4J_PASSWORD || '',
          }
          const result = await operationSwitch(options)
          console.log(JSON.stringify(result, null, 2))
        } catch (e) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          console.log(JSON.stringify({ error: (e as any).message }, null, 2))
        }
      }
    },
  },
}

const register = (yargs) => {
  yargs.command(
    'platform [resource] [action]',
    'platform operations',
    {
      env: {
        alias: 'e',
        description: 'Relative path to .env',
        demandOption: true,
      },
      input: {
        alias: 'i',
        description: 'File path as input',
      },
      output: {
        alias: 'o',
        description: 'File path as output',
      },
    },
    async (argv) => {
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
    },
  )
}
const platform = { register }
export default platform

import fs from 'fs'
import path from 'path'
import jsongraph from '../../api/rdf/jsongraph'
import * as contants from '../../constants'
import cypher from '../../api/cypher'

import operationSwitch from '../../operationSwitch'

const register = (yargs) => {
  yargs.command(
    'graph [action]',
    'graph operations',
    {
      env: {
        alias: 'e',
        description: 'Relative path to .env',
      },
      accept: {
        alias: 'a',
        description: 'Acceptable content type',
      },
      input: {
        alias: 'i',
        description: 'File path as input',
      },
    },
    async (argv) => {
      const { env, accept, input, unsafe } = argv
      if (env) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('dotenv').config({ path: env })
        const options = {
          json: fs
            .readFileSync(path.resolve(process.cwd(), input as string))
            .toString(),
          neo4jUri: process.env.NEO4J_URI || '',
          neo4jUser: process.env.NEO4J_USERNAME || '',
          neo4jPassword: process.env.NEO4J_PASSWORD || '',
        }
        const result = await operationSwitch(options)
        console.log(JSON.stringify(result, null, 2))
      } else if (accept && input) {
        if (accept === contants.graphContentType) {
          const document = JSON.parse(
            fs
              .readFileSync(path.resolve(process.cwd(), input as string))
              .toString(),
          )
          const graph = await jsongraph.fromDocument(document)
          console.log(JSON.stringify({ graph }, null, 2))
        }
        if (accept === contants.cypherContentType) {
          const document = JSON.parse(
            fs
              .readFileSync(path.resolve(process.cwd(), input as string))
              .toString(),
          )
          const graph = await jsongraph.fromDocument(document)
          const { query, params } = await cypher.fromJsonGraph(graph)
          console.log(JSON.stringify({ query, params }, null, 2))
        }
        if (accept === contants.rawCypherContentType) {
          const document = JSON.parse(
            fs
              .readFileSync(path.resolve(process.cwd(), input as string))
              .toString(),
          )
          const graph = await jsongraph.fromDocument(document)
          const { query, params } = await cypher.fromJsonGraph(graph)
          if (!unsafe) {
            console.log(JSON.stringify({ query, params }, null, 2))
          }
          console.log(cypher.makeInjectionVulnerable({ query, params }))
        }
      }
    },
  )
}
const graph = { register }
export default graph

import yargs from 'yargs'
import fs from 'fs'
import path from 'path'
import jsongraph from '../src/api/rdf/jsongraph'
import * as contants from './constants'
import cypher from '../src/api/cypher'

import operationSwitch from './operationSwitch'

const init = () => {
  yargs.scriptName('✨')
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
      file: {
        alias: 'f',
        description: 'File path as input',
      },
    },
    async (argv) => {
      const { env, accept, file, unsafe } = argv
      if (env) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('dotenv').config({ path: env })
        const options = {
          json: fs
            .readFileSync(path.resolve(process.cwd(), file as string))
            .toString(),
          neo4jUri: process.env.NEO4J_URI || '',
          neo4jUser: process.env.NEO4J_USERNAME || '',
          neo4jPassword: process.env.NEO4J_PASSWORD || '',
        }
        const result = await operationSwitch(options)
        console.log(JSON.stringify(result, null, 2))
      } else if (accept && file) {
        if (accept === contants.graphContentType) {
          const document = JSON.parse(
            fs
              .readFileSync(path.resolve(process.cwd(), file as string))
              .toString(),
          )
          const graph = await jsongraph.fromDocument(document)
          console.log(JSON.stringify({ graph }, null, 2))
        }
        if (accept === contants.cypherContentType) {
          const document = JSON.parse(
            fs
              .readFileSync(path.resolve(process.cwd(), file as string))
              .toString(),
          )
          const graph = await jsongraph.fromDocument(document)
          const { query, params } = await cypher.fromJsonGraph(graph)
          console.log(JSON.stringify({ query, params }, null, 2))
        }
        if (accept === contants.rawCypherContentType) {
          const document = JSON.parse(
            fs
              .readFileSync(path.resolve(process.cwd(), file as string))
              .toString(),
          )
          const graph = await jsongraph.fromDocument(document)
          const { query, params } = await cypher.fromJsonGraph(graph)
          if(!unsafe){
            console.log(JSON.stringify({ query, params }, null, 2))
          }
          console.log(cypher.makeInjectionVulnerable({ query, params }))
        }
      }
    },
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { file }: any = yargs.help().alias('help', 'h').argv
  const skipAction = file !== undefined
  // skip action if file is argument
  // action will parse json when this is not the case.
  return skipAction
}

const cli = { init }

export default cli

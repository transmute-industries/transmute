import fs from 'fs'

import { Arguments } from "../types"
import { setOutput, debug } from '@actions/core'
import { env } from '../action'
import { jsongraph } from './graph/jsongraph'
import { query, injection } from './graph/gql'
import { driver, push } from './graph/driver'

export const handler = async function ({ positionals, values }: Arguments) {
  positionals = positionals.slice(1)
  const operation = positionals.shift()
  switch (operation) {
    case 'assist': {
      const graphType = values['graph-type'] || 'application/vnd.jgf+json'
      const output = values.output
      const contentType: any = values['credential-type'] || values['presentation-type']
      const verbose = values.verbose || false
      const [pathToContent] = positionals
      const content = new Uint8Array(fs.readFileSync(pathToContent))
      const graph = await jsongraph.graph(content, contentType)
      let graphText = JSON.stringify(graph, null, 2)
      if (verbose) {
        const message = `🕸️ ${graphType}`
        debug(message)
      }
      if (graphType === 'application/gql') {
        const components = await query(graph)
        const dangerousQuery = await injection(components)
        graphText = dangerousQuery
        if (values.push) {
          const d = await driver()
          const session = d.session()
          await push(session, components)
          await d.close()
        }
      }
      if (output) {
        fs.writeFileSync(output, JSON.stringify(graphText, null, 2))
      }
      if (env.github()) {
        if (graphType === 'application/gql') {
          setOutput('gql', graphText)
        }
        if (graphType === 'application/vnd.jgf+json') {
          setOutput('json', graph)
        }
      } else {
        if (!output) {
          console.log(graphText)
        }
      }
      break
    }
    default: {
      const message = `😕 Unknown Command`
      console.error(message)
      throw new Error(message)
    }
  }

}
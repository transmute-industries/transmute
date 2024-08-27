import fs from 'fs'

import { Arguments } from "../types"
import { setOutput, debug } from '@actions/core'
import { env } from '../action'
import { jsongraph } from './graph/jsongraph'
import { query, injection } from './graph/gql'
import { driver, push } from './graph/driver'
import dotenv from 'dotenv'
import { getApi, getPresentations } from './presentations'

import { collate } from './collate/collate'

export const handler = async function ({ positionals, values }: Arguments) {
  positionals = positionals.slice(1)
  const operation = positionals.shift()
  const encoder = new TextEncoder()
  switch (operation) {
    case 'assist': {
      const output = values.output
      const graphType = values['graph-type'] || 'application/vnd.jgf+json'
      const contentType: any = values['content-type'] || values['credential-type'] || values['presentation-type']
      const verbose = values.verbose || false
      const [pathToContent] = positionals
      if (verbose) {
        const message = `🕸️ ${graphType}`
        debug(message)
      }
      const envFile = values.env
      if (envFile) {
        dotenv.config({ path: envFile })
      }
      let graph
      let graphText
      if (!pathToContent) {
        let allGraphText = ''
        const allGraphs = [] as any[]
        const api = await getApi()
        const presentations = await getPresentations({ sent: true, received: true, api })
        const d = await driver()
        const session = d.session()
        for (const item of presentations.items) {
          try {
            const content = encoder.encode(item.content)
            graph = await jsongraph.graph(content, 'application/vp+jwt')
            allGraphs.push(graph)
            const components = await query(graph)
            const dangerousQuery = await injection(components)
            allGraphText += dangerousQuery + '\n'
            if (verbose) {
              const message = `\n${dangerousQuery}\n`
              console.log(message)
            }
            if (values.push) {
              await push(session, components)
            }
          } catch (e) {
            if (verbose) {
              const message = `⛔ ${item.id}`
              console.error(message)
              console.error(e)
            }
          }
        }
        if (output) {
          fs.writeFileSync(output, allGraphText)
        }
        if (env.github()) {
          if (graphType === 'application/gql') {
            setOutput('gql', allGraphText)
          }
          if (graphType === 'application/vnd.jgf+json') {
            setOutput('json', allGraphs)
          }
        } else {
          if (!output) {
            console.log(allGraphText)
          }
        }


        await d.close()

      } else {
        const content = new Uint8Array(fs.readFileSync(pathToContent))
        if (contentType.includes('cose')) {
          graph = await collate(content)
          const components = await query(graph)
          const dangerousQuery = await injection(components)
          graphText = dangerousQuery
          if (values.push) {
            const d = await driver()
            const session = d.session()
            await push(session, components)
            await d.close()
          }
        } else {
          // single file
          graph = await jsongraph.graph(content, contentType)
          graphText = JSON.stringify(graph, null, 2)
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
        }

        if (output) {
          fs.writeFileSync(output, graphText)
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
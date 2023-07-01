import neo4j from 'neo4j-driver'

import { ActionOptions } from '../../types'

import jsongraph from '../../api/rdf/jsongraph'
import cypher from '../../api/cypher'
export const run = async (options: ActionOptions) => {
  const driver = neo4j.driver(
    options.neo4jUri,
    neo4j.auth.basic(options.neo4jUser, options.neo4jPassword),
  )
  const session = driver.session()
  const document = JSON.parse(options.json)
  const graph = await jsongraph.fromDocument(document)
  const { query, params } = await cypher.fromJsonGraph(graph)
  await session.run(query, params)
  await session.close()
  await driver.close()
  return { query, params }
}

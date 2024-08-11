import neo4j from 'neo4j-driver'

import { getInput } from '@actions/core'

export const driver = () => {
  const driver = neo4j.driver(
    `${process.env.NEO4J_URI || getInput("neo4j-uri")}`,
    neo4j.auth.basic(`${process.env.NEO4J_USERNAME || getInput("neo4j-user")}`, `${process.env.NEO4J_PASSWORD || getInput("neo4j-password")}`)
  )
  return driver
}

export const push = async (session: any, components: any) => {
  await session
    .run({ text: `${components.query}`, parameters: components.params })
}
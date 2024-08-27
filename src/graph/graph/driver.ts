import neo4j from 'neo4j-driver'

import { getInput, setSecret } from '@actions/core'


import { env } from '../../action'

export const driver = () => {
  const password = `${process.env.NEO4J_PASSWORD || getInput("neo4j-password")}`
  if (env.github()) {
    if (password) {
      setSecret(password)
    }
  }
  const driver = neo4j.driver(
    `${process.env.NEO4J_URI || getInput("neo4j-uri")}`,
    neo4j.auth.basic(`${process.env.NEO4J_USERNAME || getInput("neo4j-user")}`, password)
  )
  return driver
}

export const push = async (session: any, components: any) => {
  await session
    .run({ text: `${components.query}`, parameters: components.params })
}
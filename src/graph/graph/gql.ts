/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment'

// https://neo4j.com/docs/cypher-manual/current/syntax/parameters/
const setParam = (
  value: string | number,
  params: Record<number, string | number>,
) => {
  const index = Object.keys(params).length
  params[index] = value
  const param = '$' + index.toString()
  if (moment(value, moment.ISO_8601).isValid()) {
    return `datetime(${param})`
  }
  return param
}

const setProperties = (
  name: string,
  entry: any,
  params: Record<number, string | number>,
) => {
  let properties = ''
  // expect at least id and labels, hence 2 below
  if (Object.keys(entry).length > 1) {
    const { id, labels, target, source, ...props }: any = entry
    const keys = Object.keys(props)
    const statements: any = []
    for (const i in keys) {
      const key: string = keys[i]
      const value = props[keys[i]]
      statements.push(`  SET  ${name}.\`${key}\`=${setParam(value, params)}`)
    }
    properties = statements.join('\n') + '\n'
  }
  return properties
}

const addNodes = (graph, query, params) => {
  const nodes = {}
  const values = Object.values(graph.nodes)
  for (const index in values) {
    const node = values[index] as any
    const { id, labels } = node
    nodes[id] = `n${index}`
    const label = Array.isArray(labels) ? labels.join('`:`') : labels
    query += `MERGE (n${index}:\`${label}\`{id:${setParam(id, params)}}) \n`
    query += setProperties(`n${index}`, node, params)
  }
  return { nodes, query, params }
}

const addEdges = (graph, nodes, query, params) => {
  for (const i in graph.edges) {
    const link = graph.edges[i]
    const source = nodes[link.source]
    const target = nodes[link.target]
    const label = link.label
    // TODO: injection mitigation
    query += `MERGE (${source})-[e${i}:\`${label}\`]->(${target})\n`
    query += setProperties(`e${i}`, link, params)
  }
  return query
}

const removeEmptyLines = (query) => {
  return query
    .split('\n')
    .filter((line) => line !== '')
    .join('\n')
}

export const query = async (graph) => {
  // TODO: injection mitigation
  const params: Record<number, string | number> = {}
  const cypher = addNodes(graph, ``, params)
  cypher.query = addEdges(graph, cypher.nodes, cypher.query, params)
  cypher.query += `RETURN ${Object.values(cypher.nodes)}\n`
  cypher.query = removeEmptyLines(cypher.query)
  cypher.query += '\n'
  cypher.params = params
  return cypher
}

export const injection = ({
  query,
  params,
}: {
  query: string
  params: Record<number, string | number>
}) => {
  for (const p of Object.keys(params)) {
    query = query.replace(`$${p}`, params[p])
  }
  return query
}




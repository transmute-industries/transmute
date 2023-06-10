import neo4j from 'neo4j-driver'
import moment from 'moment'
import { ActionOptions } from '../src/types'

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

it.skip('params', async () => {
  const options: ActionOptions = {
    json: '',
    neo4jUri: process.env.NEO4J_URI || '',
    neo4jUser: process.env.NEO4J_USERNAME || '',
    neo4jPassword: process.env.NEO4J_PASSWORD || '',
  }
  const driver = neo4j.driver(
    options.neo4jUri,
    neo4j.auth.basic(options.neo4jUser, options.neo4jPassword),
  )
  const session = driver.session()
  const params: Record<number, string | number> = {}
  const query = `
MERGE (port: Port { 
  name: ${setParam('Port of LA', params)}, 
  age: ${setParam(10, params)},
  created: ${setParam('2023-06-10T13:18:15.383Z', params)},
  longitude: ${setParam(-118.26100002979626, params)},
  latitude: ${setParam(33.73667753692616, params)}
})
MERGE (office: Office { 
  name: ${setParam('Capital Factory', params)}, 
  longitude: ${setParam(-97.74042395979014, params)},
  latitude: ${setParam(30.2688451888236, params)}
})
MERGE
  (port)-[:TRAVEL_ROUTE]->(office)
RETURN port, office
    `
  await session.run(query, params)
  const { records } = await session.run(`
MATCH (t:Port)-[:TRAVEL_ROUTE]->(o:Office)
WITH
  point({longitude: t.longitude, latitude: t.latitude}) AS portPoint,
  point({longitude: o.longitude, latitude: o.latitude}) AS officePoint
RETURN round(point.distance(portPoint, officePoint)) AS travelDistance
  `)
  // https://en.wikipedia.org/wiki/World_Geodetic_System
  expect(records[0]['_fields']['0']).toBe(1971754)
  await session.close()
  await driver.close()
})

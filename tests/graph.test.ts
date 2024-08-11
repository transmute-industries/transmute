import * as core from '@actions/core'

import { facade } from '../src'

let debug: jest.SpiedFunction<typeof core.debug>
let output: jest.SpiedFunction<typeof core.setOutput>
let secret: jest.SpiedFunction<typeof core.setSecret>

beforeEach(() => {
  process.env.GITHUB_ACTION = 'jest-mock'
  jest.clearAllMocks()
  debug = jest.spyOn(core, 'debug').mockImplementation()
  output = jest.spyOn(core, 'setOutput').mockImplementation()
  secret = jest.spyOn(core, 'setSecret').mockImplementation()
})

// Graph

it('graph assist json', async () => {
  await facade(`graph assist ./tests/fixtures/issuer-claims.json --verbose --credential-type application/vc --graph-type application/vnd.jgf+json`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

it.skip('graph assist gql', async () => {
  await facade(`graph assist ./tests/fixtures/issuer-claims.json --verbose --credential-type application/vc --graph-type application/gql`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

it.skip('graph assist gql neo4j', async () => {
  await facade(`graph assist ./tests/fixtures/issuer-claims.json --verbose --credential-type application/vc --graph-type application/gql --push`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

it.skip('graph assist vdp', async () => {
  await facade(`graph assist --verbose --credential-type application/vc --graph-type application/gql --push --env ./.env`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

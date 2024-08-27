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


it.skip('graph assist with regular jwt', async () => {
  await facade(`graph assist ./tests/fixtures/example.jwt \
--content-type application/jwt \
--graph-type application/gql \
--env ./.env \
--verbose  --push `)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
  expect(secret).toHaveBeenCalledTimes(1)
})

it.skip('graph assist with transmute platform presentations', async () => {
  await facade(`graph assist \
--graph-type application/gql \
--env ./.env \
--push `)
  expect(debug).toHaveBeenCalledTimes(0)
  expect(output).toHaveBeenCalledTimes(1)
  expect(secret).toHaveBeenCalledTimes(1)
})




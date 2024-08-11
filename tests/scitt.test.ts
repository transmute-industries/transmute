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


it('sign', async () => {
  await facade(`scitt sign ./tests/fixtures/private.sig.key.cbor ./tests/fixtures/message.json --verbose`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(secret).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

it('verify hash', async () => {
  await facade(`scitt verify ./tests/fixtures/public.sig.key.cbor ./tests/fixtures/message.hash-envelope.cbor 3073d614f853aaec9a1146872c7bab75495ee678c8864ed3562f8787555c1e22 --verbose`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})



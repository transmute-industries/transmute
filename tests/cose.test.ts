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

it('keygen', async () => {
  await facade(`cose keygen --alg ES256 --verbose`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(secret).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

it('keypub', async () => {
  await facade(`cose keypub ./tests/fixtures/private.sig.key.cbor --verbose`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(secret).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

it('sign attached', async () => {
  await facade(`cose sign ./tests/fixtures/private.sig.key.cbor ./tests/fixtures/message.json --verbose`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(secret).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

it('verify attached', async () => {
  await facade(`cose verify ./tests/fixtures/public.sig.key.cbor ./tests/fixtures/message.signature.cbor --verbose`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

it('sign detached', async () => {
  await facade(`cose sign ./tests/fixtures/private.sig.key.cbor ./tests/fixtures/message.json --verbose --detached`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(secret).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

it('verify detached', async () => {
  await facade(`cose verify ./tests/fixtures/public.sig.key.cbor ./tests/fixtures/message.signature.cbor ./tests/fixtures/message.json --verbose --detached`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})


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
  await facade(`jose keygen --alg ES256 --verbose`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(secret).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

it('keypub', async () => {
  await facade(`jose keypub ./scripts/diagnostic/private.sig.jwk.json --verbose`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(secret).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

it('sign', async () => {
  await facade(`jose sign ./scripts/diagnostic/private.sig.jwk.json ./scripts/diagnostic/message.json --verbose`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(secret).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

it('sign detached', async () => {
  await facade(`jose sign ./scripts/diagnostic/private.sig.jwk.json ./scripts/diagnostic/message.json --verbose --detached`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(secret).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

it('verify', async () => {
  await facade(`jose verify ./scripts/diagnostic/public.sig.jwk.json ./scripts/diagnostic/message.signature.json --verbose`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

it('verify detached', async () => {
  await facade(`jose verify ./scripts/diagnostic/public.sig.jwk.json ./scripts/diagnostic/message.signature.detached.json ./scripts/diagnostic/message.json --verbose --detached`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

it('encrypt', async () => {
  await facade(`jose encrypt ./scripts/diagnostic/public.enc.jwk.json ./scripts/diagnostic/message.json --verbose --enc A128GCM`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

it('decrypt', async () => {
  await facade(`jose decrypt ./scripts/diagnostic/private.enc.jwk.json ./scripts/diagnostic/message.ciphertext.json --verbose`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})


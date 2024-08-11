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


it('issuer-claims', async () => {
  await facade(`vcwg issuer-claims ./tests/fixtures/issuer-claims.json --verbose`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

it('issue-credential', async () => {
  await facade(`vcwg issue-credential ./tests/fixtures/private.sig.jwk.json ./tests/fixtures/issuer-claims.yaml --verbose --credential-type application/vc-ld+jwt`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(secret).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

it('verify-credential', async () => {
  await facade(`vcwg verify-credential ./tests/fixtures/public.sig.jwk.json ./tests/fixtures/issuer-claims.jwt --verbose --credential-type application/vc-ld+jwt`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

it('issue-presentation', async () => {
  await facade(`vcwg issue-presentation ./tests/fixtures/private.sig.jwk.json ./tests/fixtures/issuer-claims.jwt --verbose --credential-type application/vc-ld+jwt --presentation-type application/vp-ld+jwt`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(secret).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

it('verify-presentation', async () => {
  await facade(`vcwg verify-presentation ./tests/fixtures/public.sig.jwk.json ./tests/fixtures/holder-claims.jwt --verbose --presentation-type application/vp-ld+jwt`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})





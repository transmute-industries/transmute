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

// JWT

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

// SD-JWT 

it('issue-credential', async () => {
  await facade(`vcwg issue-credential ./tests/fixtures/private.sig.jwk.json ./tests/fixtures/issuer-disclosable-claims.yaml --verbose --credential-type application/vc-ld+sd-jwt`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(secret).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

it('verify-credential', async () => {
  await facade(`vcwg verify-credential ./tests/fixtures/public.sig.jwk.json ./tests/fixtures/issuer-disclosable-claims.sd-jwt --verbose --credential-type application/vc-ld+sd-jwt`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

it('issue-presentation', async () => {
  await facade(`vcwg issue-presentation ./tests/fixtures/private.sig.jwk.json ./tests/fixtures/issuer-disclosable-claims.sd-jwt ./tests/fixtures/holder-disclosed-claims.yaml --verbose --credential-type application/vc-ld+sd-jwt --presentation-type application/vp-ld+sd-jwt`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(secret).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

it('verify-presentation', async () => {
  await facade(`vcwg verify-presentation ./tests/fixtures/public.sig.jwk.json ./tests/fixtures/holder-disclosed-claims.sd-jwt --verbose --presentation-type application/vp-ld+sd-jwt`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

// COSE

it('issue-credential', async () => {
  await facade(`vcwg issue-credential ./tests/fixtures/private.sig.jwk.json ./tests/fixtures/issuer-claims.yaml --verbose --credential-type application/vc-ld+cose`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(secret).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

it('verify-credential', async () => {
  await facade(`vcwg verify-credential ./tests/fixtures/public.sig.jwk.json ./tests/fixtures/issuer-claims.cbor --verbose --credential-type application/vc-ld+cose`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

it('issue-presentation', async () => {
  await facade(`vcwg issue-presentation ./tests/fixtures/private.sig.jwk.json ./tests/fixtures/issuer-claims.cbor --verbose --credential-type application/vc-ld+cose --presentation-type application/vp-ld+cose`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(secret).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

it('verify-presentation', async () => {
  await facade(`vcwg verify-presentation ./tests/fixtures/public.sig.jwk.json ./tests/fixtures/holder-claims.cbor --verbose --presentation-type application/vp-ld+cose`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

// Graph

it('graph json', async () => {
  await facade(`vcwg graph ./tests/fixtures/issuer-claims.json --verbose --credential-type application/vc --graph-type application/vnd.jgf+json`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

it('graph gql', async () => {
  await facade(`vcwg graph ./tests/fixtures/issuer-claims.json --verbose --credential-type application/vc --graph-type application/gql`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})

it.skip('graph gql neo4j', async () => {
  await facade(`vcwg graph ./tests/fixtures/issuer-claims.json --verbose --credential-type application/vc --graph-type application/gql --push`)
  expect(debug).toHaveBeenCalledTimes(1)
  expect(output).toHaveBeenCalledTimes(1)
})


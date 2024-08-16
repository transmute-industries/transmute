import * as core from '@actions/core'

import { facade } from '../src'

let debug: jest.SpiedFunction<typeof core.debug>
let output: jest.SpiedFunction<typeof core.setOutput>
let secret: jest.SpiedFunction<typeof core.setSecret>

describe.skip('azure key vault', () => {

  beforeEach(() => {
    process.env.GITHUB_ACTION = 'jest-mock'
    jest.clearAllMocks()
    debug = jest.spyOn(core, 'debug').mockImplementation()
    output = jest.spyOn(core, 'setOutput').mockImplementation()
    secret = jest.spyOn(core, 'setSecret').mockImplementation()
  })

  it('issue-statement', async () => {
    await facade(`
  scitt issue-statement ./tests/fixtures/message.json \
  --azure-keyvault \
  --env ./.env \
  --alg ES256 \
  --iss https://software.vendor.example \
  --sub https://software.vendor.example/product/123 \
  --content-type application/spdx+json \
  --location https://software.vendor.example/storage/456 \
  --output ./tests/fixtures/message.json.akv.cbor \
  --verbose
  `)
    expect(debug).toHaveBeenCalledTimes(1)
    expect(secret).toHaveBeenCalledTimes(1)
    expect(output).toHaveBeenCalledTimes(1)
  })

  it('export-remote-public-key', async () => {
    await facade(`
  scitt export-remote-public-key \
  --azure-keyvault \
  --env ./.env \
  --output ./tests/fixtures/public.akv.key.cbor \
  --verbose
  `)
    expect(debug).toHaveBeenCalledTimes(1)
    expect(secret).toHaveBeenCalledTimes(1)
    expect(output).toHaveBeenCalledTimes(1)
  })

  it('verify-statement-hash', async () => {
    await facade(`
  scitt verify-statement-hash \
  ./tests/fixtures/public.akv.key.cbor \
  ./tests/fixtures/message.json.akv.cbor \
  3073d614f853aaec9a1146872c7bab75495ee678c8864ed3562f8787555c1e22 \
  --verbose 
  `)
    expect(debug).toHaveBeenCalledTimes(1)
    expect(secret).toHaveBeenCalledTimes(0)
    expect(output).toHaveBeenCalledTimes(1)
  })

  it('issue-receipt', async () => {
    await facade(`
  scitt issue-receipt \
  ./tests/fixtures/message.json.akv.cbor \
  --azure-keyvault \
  --env ./.env \
  --log ./tests/fixtures/trans.json \
  --output ./tests/fixtures/message.akv.receipt.cbor \
  --verbose 
  `)
    expect(debug).toHaveBeenCalledTimes(1)
    expect(secret).toHaveBeenCalledTimes(1)
    expect(output).toHaveBeenCalledTimes(1)
  })

  it('verify-receipt-hash', async () => {
    await facade(`
  scitt verify-receipt-hash \
  ./tests/fixtures/public.akv.key.cbor \
  ./tests/fixtures/message.akv.receipt.cbor \
  3073d614f853aaec9a1146872c7bab75495ee678c8864ed3562f8787555c1e22 \
  --output ./tests/fixtures/message.akv.receipt.cbor.verified \
  --verbose
  `)
    expect(debug).toHaveBeenCalledTimes(1)
    expect(output).toHaveBeenCalledTimes(1)
  })
})



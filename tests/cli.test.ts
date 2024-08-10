import cli from '../src'

it('cli exports facade', async () => {
  await cli.facade(`
jose key generate --alg ES256
`)
})
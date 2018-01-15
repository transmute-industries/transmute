import { W3, Relic, EventTransformer, PackageManager } from '../transmute-framework'

/**
 * contract tests
 */
describe('contract tests', () => {
  let accounts
  beforeAll(async () => {
    let relic = new Relic({
      providerUrl: 'http://localhost:8545'
    })
    accounts = await relic.getAccounts()
    W3.Default = relic.web3
  })

  it('can create a contract', async () => {
    let packageManagerContract = await PackageManager.New(
      W3.TC.txParamsDefaultDeploy(accounts[0]),
      {
        _multisig: accounts[0]
      }
    )

    let countAsBigNum = await packageManagerContract.eventCount()
    expect(countAsBigNum.toNumber()).toBe(1)

    let eventValues = await packageManagerContract.readEvent(0)
    let event = EventTransformer.arrayToFSA(eventValues)
    expect(event.type).toBe('NEW_OWNER')
  })
})

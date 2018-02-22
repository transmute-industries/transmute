import { getDefaultRelic } from '../__mocks__/getRelic'
import { Relic, EventTransformer, PackageManager } from '../transmute-framework'
import { W3 } from 'soltsice'
/**
 * contract tests
 */
describe('contract tests', () => {
  let accounts
  beforeAll(async () => {
    let relic = getDefaultRelic()
    accounts = await relic.getAccounts()
    W3.Default = relic.web3
  })

  it('can create a contract', async () => {
    let packageManagerContract = await PackageManager.New(
      W3.TX.txParamsDefaultDeploy(accounts[0]),
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

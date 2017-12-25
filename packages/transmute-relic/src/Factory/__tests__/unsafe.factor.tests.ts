import Relic from '../../transmute-relic'
import { Factory } from '../Factory'
import { W3 } from 'soltsice'
import { UnsafeEventStoreFactory } from '../../types/UnsafeEventStoreFactory'

/**
 * UnsafeEventStoreFactory test
 */
describe('UnsafeEventStoreFactory', () => {
  const cfg = {
    providerUrl: 'http://localhost:8545'
  }

  let relic: Relic
  let accounts: string[]
  let factory: UnsafeEventStoreFactory

  const setup = async () => {
    relic = new Relic(cfg)
    accounts = await relic.getAccounts()
    factory = await Factory.create(Factory.Types.UnsafeEventStoreFactory, relic.web3, accounts[0])
  }

  it('has creator', async () => {
    await setup()
    expect(await factory.creator()).toBe(accounts[0])
  })

  it('can create unsafe stores ', async () => {
    await setup()
    let fromAddress = accounts[0]
    let events = await Factory.createStore(factory, relic.web3, fromAddress)
    expect(events.length).toBe(1)
    expect(events[0].type).toBe('ES_CREATED')
  })
})

import { getDefaultRelic } from '../../../__mocks__/getRelic'
import {
  W3,
  Relic,
  Utils,
  InternalEventTypes,
  IFSA,
  EventTransformer,
  EventStoreFactory,
  EventStore
} from '../../../transmute-framework'

/**
 * EventStoreFactory spec
 */
describe('EventStoreFactory', () => {
  let relic: Relic
  let accounts: string[]
  let factory: EventStoreFactory
  let receipt: any
  let events: IFSA[]

  beforeAll(async () => {
    relic = await getDefaultRelic()
    accounts = await relic.getAccounts()
  })

  describe('factory ownership', async () => {
    it('the factory owner is the creator (caller of New)', async () => {
      // create a new factory
      factory = await EventStoreFactory.New(W3.TC.txParamsDefaultDeploy(accounts[0]), {
        _multisig: accounts[0]
      })

      // the factory owner is the factory contract deployer
      let factoryOwner = await factory.owner()
      expect(relic.web3.utils.toChecksumAddress(factoryOwner)).toBe(accounts[0])
    })

    it('the factory owner can transferOwnership', async () => {
      // create a new factory
      factory = await EventStoreFactory.New(W3.TC.txParamsDefaultDeploy(accounts[0]), {
        _multisig: accounts[0]
      })

      // the factory owner can transferOwnership
      let receipt = await factory.transferOwnership(
        accounts[1],
        W3.TC.txParamsDefaultDeploy(accounts[0])
      )
      events = EventTransformer.getFSAsFromReceipt(receipt)
      expect(events[0].type).toBe(InternalEventTypes.NEW_OWNER)
      expect(relic.web3.utils.toChecksumAddress(events[0].payload.value)).toBe(accounts[1])

      // the event was not a lie
      let factoryOwner = await factory.owner()
      expect(relic.web3.utils.toChecksumAddress(factoryOwner)).toBe(accounts[1])
    })
  })
})

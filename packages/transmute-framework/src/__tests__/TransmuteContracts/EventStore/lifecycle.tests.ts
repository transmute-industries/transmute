import { getDefaultRelic } from '../../../__mocks__/getRelic'
import { W3 } from 'soltsice'
import {
  Relic,
  Utils,
  EventTransformer,
  IFSA,
  EventStoreFactory,
  EventStore,
  InternalEventTypes
} from '../../../transmute-framework'

/**
 * EventStore spec
 */
describe('EventStore', () => {
  let relic: Relic
  let accounts: string[]
  let factory: EventStoreFactory
  let receipt: any
  let events: IFSA[]

  beforeAll(async () => {
    relic = await getDefaultRelic()
    accounts = await relic.getAccounts()
  })

  describe('eventStore lifecycle', async () => {
    it('the eventStore owner can recycle the balance to themself', async () => {
      // create a new factory
      let fundingAmountWei = 13370000000000000
      factory = await EventStoreFactory.New(
        W3.TX.txParamsDefaultDeploy(accounts[0]),
        {
          _multisig: accounts[0]
        }
      )

      // create an eventStore with the factory
      let whitelist = accounts.slice(2, 4)
      receipt = await factory.createEventStore(
        whitelist,
        W3.TX.txParamsDefaultDeploy(accounts[1])
      )
      events = EventTransformer.getFSAsFromReceipt(receipt)
      let factoryEvents = EventTransformer.filterEventsByMeta(
        events,
        'msgSender',
        accounts[1]
      )
      let eventStore = await EventStore.At(factoryEvents[0].payload.value)

      // fund the eventStore
      receipt = await eventStore.sendTransaction({
        from: accounts[0],
        value: fundingAmountWei
      } as any)
      let updatedFactoryBalance = await relic.getBalance(eventStore.address)
      expect(updatedFactoryBalance).toBe(fundingAmountWei)

      // get the owner intial balance
      let initialOwnerBalance = await relic.getBalance(accounts[1])

      // transfers funds to owner via selfdestruct
      receipt = await eventStore.recycle(
        W3.TX.txParamsDefaultDeploy(accounts[1])
      )
      events = EventTransformer.getFSAsFromReceipt(receipt)
      expect(events[0].type).toBe(InternalEventTypes.RECYCLED_TO)
      expect(events[0].payload.value).toBe(accounts[1])

      // ensure owner received funds
      let ownerBalanceAfterRecycle = await relic.getBalance(accounts[1])
      expect(ownerBalanceAfterRecycle).toBeGreaterThan(initialOwnerBalance)

      // recycled factories are owned by 0x0
      let eventStoreOwner = await eventStore.owner()
      expect(eventStoreOwner).toBe('0x0')
    })

    it('the eventStore owner can recycleAndSend the balance to a recipient', async () => {
      // create a new factory
      let fundingAmountWei = 13370000000000000
      factory = await EventStoreFactory.New(
        W3.TX.txParamsDefaultDeploy(accounts[0]),
        {
          _multisig: accounts[0]
        }
      )

      // create an eventStore with the factory
      let whitelist = accounts.slice(2, 4)
      receipt = await factory.createEventStore(
        whitelist,
        W3.TX.txParamsDefaultDeploy(accounts[1])
      )
      events = EventTransformer.getFSAsFromReceipt(receipt)
      let factoryEvents = EventTransformer.filterEventsByMeta(
        events,
        'msgSender',
        accounts[1]
      )
      let eventStore = await EventStore.At(factoryEvents[0].payload.value)

      // fund the eventStore
      receipt = await eventStore.sendTransaction({
        from: accounts[0],
        value: fundingAmountWei
      } as any)
      let updatedFactoryBalance = await relic.getBalance(eventStore.address)
      expect(updatedFactoryBalance).toBe(fundingAmountWei)

      // get the owner intial balance
      let initialRecipientBalance = await relic.getBalance(accounts[2])

      // transfers funds to owner via selfdestruct
      receipt = await eventStore.recycleAndSend(
        accounts[2],
        W3.TX.txParamsDefaultDeploy(accounts[1])
      )
      events = EventTransformer.getFSAsFromReceipt(receipt)
      expect(events[0].type).toBe(InternalEventTypes.RECYCLED_TO)
      expect(events[0].payload.value).toBe(accounts[2])

      // ensure owner received funds
      let recipientBalanceAfterRecycle = await relic.getBalance(accounts[2])
      expect(initialRecipientBalance).toBeGreaterThanOrEqual(
        initialRecipientBalance
      )

      // recycled factories are owned by 0x0
      let eventStoreOwner = await eventStore.owner()
      expect(eventStoreOwner).toBe('0x0')
    })
  })
})

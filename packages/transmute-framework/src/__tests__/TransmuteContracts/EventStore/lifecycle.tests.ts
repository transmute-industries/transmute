import { W3 } from 'soltsice'
import { EventStoreFactory, EventStore } from '../../../TransmuteContracts'
import { getRelic } from '../../../__mocks__/setup'
import * as EventTransformer from '../../../Utils/EventTransformer'
import { IFSA } from '../../../Store/EventTypes'
import Relic from '../../../transmute-framework'

import * as InternalEventTypes from '../../../Utils/InternalEventTypes'

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
    relic = await getRelic()
    accounts = await relic.getAccounts()
  })

  describe('eventStore lifecycle', async () => {
    it('the eventStore owner can recycle the balance to themself', async () => {
      // create a new factory
      let fundingAmountWei = 13370000000000000000
      factory = await EventStoreFactory.New(W3.TC.txParamsDefaultDeploy(accounts[0]), {
        _multisig: accounts[0]
      })

      // create an eventStore with the factory
      let whitelist = accounts.slice(2, 4)
      receipt = await factory.createEventStore(whitelist, W3.TC.txParamsDefaultDeploy(accounts[1]))
      events = EventTransformer.getFSAsFromReceipt(receipt)
      let factoryEvents = EventTransformer.filterEventsByMeta(events, 'msgSender', accounts[1])
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
      receipt = await eventStore.recycle(W3.TC.txParamsDefaultDeploy(accounts[1]))
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
      let fundingAmountWei = 13370000000000000000
      factory = await EventStoreFactory.New(W3.TC.txParamsDefaultDeploy(accounts[0]), {
        _multisig: accounts[0]
      })

      // create an eventStore with the factory
      let whitelist = accounts.slice(2, 4)
      receipt = await factory.createEventStore(whitelist, W3.TC.txParamsDefaultDeploy(accounts[1]))
      events = EventTransformer.getFSAsFromReceipt(receipt)
      let factoryEvents = EventTransformer.filterEventsByMeta(events, 'msgSender', accounts[1])
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
        W3.TC.txParamsDefaultDeploy(accounts[1])
      )
      events = EventTransformer.getFSAsFromReceipt(receipt)
      expect(events[0].type).toBe(InternalEventTypes.RECYCLED_TO)
      expect(events[0].payload.value).toBe(accounts[2])

      // ensure owner received funds
      let recipientBalanceAfterRecycle = await relic.getBalance(accounts[2])
      expect(initialRecipientBalance).toBeGreaterThanOrEqual(initialRecipientBalance)

      // recycled factories are owned by 0x0
      let eventStoreOwner = await eventStore.owner()
      expect(eventStoreOwner).toBe('0x0')
    })
  })
})

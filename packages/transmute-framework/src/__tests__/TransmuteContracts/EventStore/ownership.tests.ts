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

  const transferOwnershipTest = async (eventStore: EventStore, newOwner: string) => {
    let currentOwner = await eventStore.owner()
    receipt = await eventStore.transferOwnership(
      newOwner,
      W3.TC.txParamsDefaultDeploy(currentOwner)
    )
    events = EventTransformer.getFSAsFromReceipt(receipt)
    expect(events[0].type).toEqual(InternalEventTypes.NEW_OWNER)
    expect(events[0].payload.value).toEqual(newOwner)

    currentOwner = await eventStore.owner()
    expect(currentOwner).toEqual(newOwner)
  }

  describe('eventStore creation', async () => {
    it('can create eventStore with the factory', async () => {
      // create a new factory
      factory = await EventStoreFactory.New(W3.TC.txParamsDefaultDeploy(accounts[0]), {
        _multisig: accounts[0]
      })

      let whitelist = accounts.slice(2, 4)

      receipt = await factory.createEventStore(whitelist, W3.TC.txParamsDefaultDeploy(accounts[0]))
      events = EventTransformer.getFSAsFromReceipt(receipt)
      let factoryEvents = EventTransformer.filterEventsByMeta(events, 'msgSender', accounts[0])

      let eventStore = await EventStore.At(factoryEvents[0].payload.value)

      // the eventStore whitelist is setup correctly
      let eventStoreWhitelist = await eventStore.getWhitelist()
      expect(eventStoreWhitelist).toEqual(whitelist)

      // we expect 3 events in a newly created eventStore
      let eventCount = await eventStore.eventCount()
      expect(eventCount.toNumber()).toBe(3)

      let esEventValues = await eventStore.readEvent(2, W3.TC.txParamsDefaultSend(accounts[0]))
      let event = EventTransformer.arrayToFSA(esEventValues)

      // we expect the factory caller to be the owner
      expect(event.type).toBe(InternalEventTypes.NEW_OWNER)
      expect(event.payload.value).toBe(accounts[0])
      let eventStoreOwner = await eventStore.owner()
      expect(eventStoreOwner).toBe(accounts[0])

      // can transferOwnership
      await transferOwnershipTest(eventStore, accounts[7])
    })

    it('can create eventStore with out the factory', async () => {
      // create EventStore without the factory
      let eventStore = await EventStore.New(W3.TC.txParamsDefaultDeploy(accounts[0]), {
        _multisig: accounts[0]
      })

      // expect 1 event in this case
      let eventCount = await eventStore.eventCount()
      expect(eventCount.toNumber()).toBe(1)

      // expect the event to be NEW_OWNER
      let esEventValues = await eventStore.readEvent(0, W3.TC.txParamsDefaultSend(accounts[0]))
      let event = EventTransformer.arrayToFSA(esEventValues)
      expect(event.type).toBe(InternalEventTypes.NEW_OWNER)
      expect(event.payload.value).toBe(accounts[0])

      // expect the eventStore owner to be correct
      let eventStoreOwner = await eventStore.owner()
      expect(event.payload.value).toBe(eventStoreOwner)

      // expect the eventStore whitelist to be empty
      let eventStoreWhitelist = await eventStore.getWhitelist()
      expect(eventStoreWhitelist).toEqual([])

      // need to setWhitelist before we can use the store
      let whitelist = accounts.slice(3, 5)
      receipt = await eventStore.setWhitelist(
        whitelist,
        W3.TC.txParamsDefaultDeploy(eventStoreOwner)
      )
      events = EventTransformer.getFSAsFromReceipt(receipt)
      expect(events[0].type).toBe(InternalEventTypes.WL_SET)

      // ownership can be transfered
      await transferOwnershipTest(eventStore, accounts[6])
    })
  })
})

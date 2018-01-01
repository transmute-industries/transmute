import { W3 } from 'soltsice'
import { EventStoreFactory, EventStore } from '../../../TransmuteContracts'
import { getRelic } from '../../../__mocks__/setup'
import { Relic, Utils } from '../../../transmute-framework'
import * as InternalEventTypes from '../../../Store/Events/InternalEventTypes'
import * as EventTransformer from '../../../Store/Events/EventTransformer'
import { IFSA } from '../../../Store/Events/EventTypes'

/**
 * EventStoreFactory spec
 */
describe('EventStoreFactory', () => {
  let factory: EventStoreFactory
  let receipt: any
  let events: IFSA[]

  const createEventStoreTest = async (ownerAccount: string, whitelist: string[]) => {
    // create a new factory
    factory = await EventStoreFactory.New(W3.TC.txParamsDefaultDeploy(ownerAccount))

    // create an eventStore
    receipt = await factory.createEventStore(whitelist, W3.TC.txParamsDefaultDeploy(ownerAccount))
    events = EventTransformer.getFSAsFromReceipt(receipt)

    // the factory records the store was created
    let factoryEvents = EventTransformer.filterEventsByMeta(events, 'msgSender', ownerAccount)
    expect(factoryEvents.length).toBe(1)
    expect(factoryEvents[0].type).toEqual(InternalEventTypes.ES_CREATED)

    // the eventStore records ownership and setup performed by the factory
    let eventStoreEvents = EventTransformer.filterEventsByMeta(events, 'msgSender', factory.address)
    expect(eventStoreEvents.length).toBe(3)
    expect(eventStoreEvents[0].type).toEqual(InternalEventTypes.NEW_OWNER)
    expect(eventStoreEvents[1].type).toEqual(InternalEventTypes.WL_SET)
    expect(eventStoreEvents[2].type).toEqual(InternalEventTypes.NEW_OWNER)
    expect(eventStoreEvents[2].payload.value).toEqual(ownerAccount)

    // the eventStore whitelist is setup correctly
    let eventStore = await EventStore.At(factoryEvents[0].payload.value)
    let eventStoreWhitelist = await eventStore.getWhitelist()
    expect(eventStoreWhitelist).toEqual(whitelist)

    // the factory eventStore list is correct
    let factoryEventStoreList = await factory.getEventStores()
    expect(factoryEventStoreList).toEqual([factoryEvents[0].payload.value])

    let eventCount = await factory.eventCount()
    expect(eventCount.toNumber()).toBe(1)

    // factory has an ES_CREATE event
    let esEventValues = await factory.readEvent(0, W3.TC.txParamsDefaultSend(ownerAccount))
    let event = EventTransformer.arrayToFSA(esEventValues)
    expect(event.type).toBe(InternalEventTypes.ES_CREATED)
  }

  describe('factory eventstore creation', async () => {
    let relic: Relic
    let accounts: string[]

    beforeAll(async () => {
      relic = await getRelic()
      accounts = await relic.getAccounts()
    })

    it('the factory owner can createEventStore', async () => {
      let ownerAccount = accounts[0]
      let whitelist = accounts.slice(0, 6)
      await createEventStoreTest(ownerAccount, whitelist)
    })

    it('non owner can create an eventStore', async () => {
      let ownerAccount = accounts[2]
      let whitelist = accounts.slice(3, 5)
      await createEventStoreTest(ownerAccount, whitelist)
    })

    it('getInternalEventTypes', async () => {
      let types = ((await factory.getInternalEventTypes()) as any).map(Utils.toAscii)
      expect(types).toEqual(InternalEventTypes.FACTORY)
    })
  })
})

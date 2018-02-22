import { getDefaultRelic } from '../../../__mocks__/getRelic'
import { W3 } from 'soltsice'
import {
  Relic,
  Utils,
  InternalEventTypes,
  EventTransformer,
  IFSA,
  EventStoreFactory,
  EventStore
} from '../../../transmute-framework'

/**
 * EventStoreFactory spec
 */
describe('EventStoreFactory', () => {
  const createEventStoreTest = async (
    ownerAccount: string,
    whitelist: string[]
  ) => {
    let factory: EventStoreFactory
    let receipt: any
    let events: IFSA[]
    // create a new factory
    factory = await EventStoreFactory.New(
      W3.TX.txParamsDefaultDeploy(ownerAccount)
    )

    // create an eventStore
    receipt = await factory.createEventStore(
      whitelist,
      W3.TX.txParamsDefaultDeploy(ownerAccount)
    )
    events = EventTransformer.getFSAsFromReceipt(receipt)

    // the factory records the store was created
    let factoryEvents = EventTransformer.filterEventsByMeta(
      events,
      'msgSender',
      ownerAccount
    )
    expect(factoryEvents.length).toBe(1)
    expect(factoryEvents[0].type).toEqual(InternalEventTypes.ES_CREATED)

    // the eventStore records ownership and setup performed by the factory
    let eventStoreEvents = EventTransformer.filterEventsByMeta(
      events,
      'msgSender',
      Utils.toChecksumAddress(factory.address)
    )
    expect(eventStoreEvents.length).toBe(3)
    expect(eventStoreEvents[0].type).toEqual(InternalEventTypes.NEW_OWNER)
    expect(eventStoreEvents[1].type).toEqual(InternalEventTypes.WL_SET)
    expect(eventStoreEvents[2].type).toEqual(InternalEventTypes.NEW_OWNER)
    expect(eventStoreEvents[2].payload.value).toEqual(ownerAccount)

    // the eventStore whitelist is setup correctly
    let eventStore = await EventStore.At(factoryEvents[0].payload.value)
    let eventStoreWhitelist = await eventStore.getWhitelist()
    expect(eventStoreWhitelist.map(Utils.toChecksumAddress)).toEqual(whitelist)

    // the factory eventStore list is correct
    let factoryEventStoreList = await factory.getEventStores()
    expect(factoryEventStoreList.map(Utils.toChecksumAddress)).toEqual([
      factoryEvents[0].payload.value
    ])

    let eventCount = await factory.eventCount()
    expect(eventCount.toNumber()).toBe(1)

    // factory has an ES_CREATE event
    let esEventValues = await factory.readEvent(
      0,
      W3.TX.txParamsDefaultSend(ownerAccount)
    )
    let event = EventTransformer.arrayToFSA(esEventValues)
    expect(event.type).toBe(InternalEventTypes.ES_CREATED)
  }

  describe('factory eventstore creation', async () => {
    let relic: Relic
    let accounts: string[]

    beforeAll(async () => {
      relic = await getDefaultRelic()
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
      let factory = await EventStoreFactory.New(
        W3.TX.txParamsDefaultDeploy(accounts[0])
      )
      let types = ((await factory.getInternalEventTypes()) as any).map(
        Utils.toAscii
      )
      expect(types).toEqual(InternalEventTypes.FACTORY)
    })
  })
})

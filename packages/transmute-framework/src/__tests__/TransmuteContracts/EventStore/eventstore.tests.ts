import { getRelic } from '../../../__mocks__/setup'

import {
  W3,
  Relic,
  Utils,
  EventStoreFactory,
  EventStore,
  InternalEventTypes,
  EventTransformer,
  IFSA
} from '../../../transmute-framework'

import MarshalledEvents from '../../../__mocks__/MarshalledEvents'

const WRITE_EVENT_GAS_COST = 4000000

/**
 * EventStore spec
 */
describe('EventStore', () => {
  let relic: Relic
  let accounts: string[]
  let factory: EventStoreFactory
  let eventStore: EventStore
  let receipt: any
  let events: IFSA[]
  let whitelist: string[]

  beforeAll(async () => {
    relic = await getRelic()
    accounts = await relic.getAccounts()
    whitelist = accounts.slice(0, 4)
    factory = await EventStoreFactory.New(W3.TC.txParamsDefaultDeploy(accounts[0]), {
      _multisig: accounts[0]
    })
    receipt = await factory.createEventStore(whitelist, W3.TC.txParamsDefaultDeploy(accounts[1]))
    events = EventTransformer.getFSAsFromReceipt(receipt)
    let factoryEvents = EventTransformer.filterEventsByMeta(events, 'msgSender', accounts[1])
    eventStore = await EventStore.At(factoryEvents[0].payload.value)
  })

  const readAndWriteEventsTest = async () => {
    MarshalledEvents.map(event => {
      it(JSON.stringify(event), async () => {
        let receipt = await eventStore.writeEvent(
          event.eventType,
          event.keyType,
          event.valueType,
          event.key,
          event.value,
          W3.TC.txParamsDefaultDeploy(accounts[0], WRITE_EVENT_GAS_COST)
        )

        expect(receipt.logs.length).toBe(1)

        let writtenFSA = EventTransformer.esEventToFSA(receipt.logs[0].args as any)
        expect(writtenFSA.meta.keyType).toBe(event.keyType)
        expect(writtenFSA.meta.valueType).toBe(event.valueType)

        let eventValues = await eventStore.readEvent(0, W3.TC.txParamsDefaultDeploy(accounts[0]))
        let readFSA = EventTransformer.arrayToFSA(eventValues)

        expect(writtenFSA.meta.keyType).toBe(event.keyType)
        expect(writtenFSA.meta.valueType).toBe(event.valueType)
      })
    })
  }

  describe('eventStore read and write', () => {
    readAndWriteEventsTest()
  })

  it('eventCount', async () => {
    // create a new factory
    factory = await EventStoreFactory.New(W3.TC.txParamsDefaultDeploy(accounts[0]), {
      _multisig: accounts[0]
    })
    // create a new eventStore
    receipt = await factory.createEventStore(whitelist, W3.TC.txParamsDefaultDeploy(accounts[1]))
    events = EventTransformer.getFSAsFromReceipt(receipt)
    let factoryEvents = EventTransformer.filterEventsByMeta(events, 'msgSender', accounts[1])
    eventStore = await EventStore.At(factoryEvents[0].payload.value)
    let eventCount = await eventStore.eventCount()
    expect(eventCount.toNumber()).toBe(3)
  })

  it('getInternalEventTypes', async () => {
    // create a new factory
    factory = await EventStoreFactory.New(W3.TC.txParamsDefaultDeploy(accounts[0]), {
      _multisig: accounts[0]
    })
    // create a new eventStore
    receipt = await factory.createEventStore(whitelist, W3.TC.txParamsDefaultDeploy(accounts[1]))
    events = EventTransformer.getFSAsFromReceipt(receipt)
    let factoryEvents = EventTransformer.filterEventsByMeta(events, 'msgSender', accounts[1])
    eventStore = await EventStore.At(factoryEvents[0].payload.value)

    let types = ((await eventStore.getInternalEventTypes()) as any).map(Utils.toAscii)
    expect(types).toEqual(InternalEventTypes.STORE)
  })
})

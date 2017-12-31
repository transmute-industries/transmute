import { W3 } from 'soltsice'
import { EventStoreFactory, EventStore } from '../../../SolidityTypes'
import { getRelic } from '../../../__mocks__/setup'
import { EventTransformer } from '../../../Utils/EventTransformer'
import { IFSA } from '../../../Store/EventTypes'
import Relic from '../../../transmute-relic'
import MarshalledEvents from '../../../__mocks__/MarshalledEvents'

const WRITE_EVENT_GAS_COST = 4000000

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

  const getEventStore = async () => {
    let whitelist = accounts.slice(0, 3)
    factory = await EventStoreFactory.New(W3.TC.txParamsDefaultDeploy(accounts[0]), {
      _multisig: accounts[0]
    })
    // create a new eventStore
    receipt = await factory.createEventStore(whitelist, W3.TC.txParamsDefaultDeploy(accounts[1]))
    events = EventTransformer.getFSAsFromReceipt(receipt)
    let factoryEvents = EventTransformer.filterEventsByMeta(events, 'msgSender', accounts[1])
    return EventStore.At(factoryEvents[0].payload.value)
  }

  describe('eventStore poisoning is not possible', async () => {
    it('the eventStore owner cannot write INTERNAL_EVENT_TYPES via the external writeEvent method', async () => {
      let eventStore = await getEventStore()
      let internalEventTypes: string[] = (await eventStore.getInternalEventTypes()) as any
      internalEventTypes.forEach(async internalEventType => {
        try {
          let event = MarshalledEvents[0]
          let receipt = await eventStore.writeEvent(
            internalEventType,
            event.keyType,
            event.valueType,
            event.key,
            event.value,
            W3.TC.txParamsDefaultDeploy(accounts[0], WRITE_EVENT_GAS_COST)
          )
        } catch (e) {
          expect(e.message).toBe('VM Exception while processing transaction: revert')
        }
      })
    })
  })
})

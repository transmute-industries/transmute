import { getSetupAsync } from '../../__mocks__/setup'
import { EventStore } from '../../TransmuteContracts/EventStore'
import { Store } from '../Store'

import Relic from '../../transmute-framework'
import { W3 } from 'soltsice'
const Storage = require('node-storage')
import { EventStoreAdapter } from '../../Store/EventStoreAdapter'
import * as EventTransformer from '../../Store/Events/EventTransformer'

const WRITE_EVENT_GAS_COST = 4000000

import events from '../__mocks__/good.events'
/**
 * Store test
 */
describe('Store', () => {
  let relic: Relic
  let accounts: string[]
  let store: EventStore
  let eventStoreAdapter: EventStoreAdapter

  beforeAll(async () => {
    let setup = await getSetupAsync()
    relic = setup.relic
    store = setup.store
    accounts = setup.accounts
    eventStoreAdapter = setup.eventStoreAdapter
  })

  events.map(event => {
    it(JSON.stringify(event), async () => {
      let writtenFSA = await Store.writeFSA(
        store,
        eventStoreAdapter,
        relic.web3,
        accounts[0],
        event
      )
      expect(writtenFSA.payload).toEqual(event.payload)
    })
  })

  // it('look at all events...', async () => {
  //   let events = await Store.readFSAs(store, eventStoreAdapter, relic.web3, accounts[0], 0)
  //   console.log(JSON.stringify(events, null, 2))
  // })
})

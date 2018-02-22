import { getSetupAsync } from '../../__mocks__/setup'
import { W3 } from 'soltsice'
import {
  Relic,
  EventStoreAdapter,
  EventTransformer,
  Store,
  EventStore
} from '../../transmute-framework'

const Storage = require('node-storage')

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
})

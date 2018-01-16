import { getSetupAsync } from '../../__mocks__/setup'

import {
  W3,
  Relic,
  Store,
  EventStore,
  EventStoreAdapter,
  EventTransformer
} from '../../transmute-framework'

const Storage = require('node-storage')

import MarshalledEvents from '../../__mocks__/MarshalledEvents'

import goodEvents from '../__mocks__/good.events'

const WRITE_EVENT_GAS_COST = 4000000
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

  it('the store rejects FSAs that are not formatted correctly', async () => {
    let badFSA = {
      type: 'test',
      payload: {
        key: 'value'
      },
      meta: {}
    }
    try {
      let fsa = await Store.writeFSA(store, eventStoreAdapter, relic.web3, accounts[0], badFSA)
    } catch (e) {
      expect(e.message).toEqual(
        'fsa.meta.adapter is not defined. be sure to set it when fsa.payload is an object (isAdapterEvent).'
      )
    }
  })

  it('the store writes FSAs that ARE NOT isAdapterEvent ', async () => {
    // add tests for all !isAdapterEvent types here....
    let goodFSA = {
      type: 'test',
      payload: {
        key: 'address',
        value: '0x01000c268181f5D90587392fF67ada1A16393FE4'
      },
      meta: {}
    }
    let fsa = await Store.writeFSA(store, eventStoreAdapter, relic.web3, accounts[0], goodFSA)
    expect(fsa.payload.key).toEqual(goodFSA.payload.key)
    expect(fsa.payload.value).toEqual(goodFSA.payload.value)
  })

  it('the store writes FSAs that ARE isAdapterEvent ', async () => {
    // add tests for all !isAdapterEvent types here....
    let goodFSA = {
      type: 'test',
      payload: {
        cool: 'story',
        bro: 1
      },
      meta: {
        adapter: 'I'
      }
    }
    let writtenFSA = await Store.writeFSA(
      store,
      eventStoreAdapter,
      relic.web3,
      accounts[0],
      goodFSA
    )
    expect(writtenFSA.payload).toEqual(goodFSA.payload)
  })

  it('read and write FSAs', async () => {
    let setup = await getSetupAsync()
    let writtenEvents = await Store.writeFSAs(
      setup.store,
      setup.eventStoreAdapter,
      setup.relic.web3,
      accounts[0],
      goodEvents
    )
    expect(writtenEvents.length).toBe(6)
    // 3 events created by the factory...
    let readAllEvents = await Store.readFSAs(setup.store, setup.eventStoreAdapter, setup.relic.web3)
    expect(readAllEvents.length).toBe(9)
  })
})

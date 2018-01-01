import { getSetupAsync } from '../../__mocks__/setup'
import { EventStore } from '../../SolidityTypes/EventStore'
import { Store } from '../Store'

import Relic from '../../transmute-relic'
import { W3 } from 'soltsice'
const Storage = require('node-storage')
import { EventStoreAdapter } from '../../Store/EventStoreAdapter'

import MarshalledEvents from '../../__mocks__/MarshalledEvents'

import * as EventTransformer from '../../Utils/EventTransformer'

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
        value: '0x01000c268181f5d90587392ff67ada1a16393fe4'
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
})

// it("sanity", async () => {
//   let event = MarshalledEvents[0];
//   let eventCount = await store.eventCount()
//   expect(eventCount.toNumber()).toBe(3);

//   let eventValues = await store.readEvent(0, W3.TC.txParamsDefaultDeploy(accounts[0]))
//   let readFSA = EventTransformer.arrayToFSA(eventValues)
//   console.log(readFSA)

//   let receipt = await store.writeEvent(
//     event.eventType,
//     event.keyType,
//     event.valueType,
//     event.key,
//     event.value,
//     W3.TC.txParamsDefaultDeploy(accounts[0], WRITE_EVENT_GAS_COST)
//   );
//   console.log(receipt.logs)
// });

// import { Store } from "../Store";
// import { getSetupAsync } from "../../__mocks__/setup";

// /**
//  * Store good events
//  */
// describe("Store can read and write events", () => {
//   let setup: any;

//   beforeAll(async () => {
//     setup = await getSetupAsync();
//   });

//   it("writeFSAs", async () => {
//     let { store, adapter, relic, accounts } = setup;
//     let writtenEvents = await Store.writeFSAs(store, adapter, relic.web3, accounts[0], allEvents);
//     expect(writtenEvents.length).toBe(6);
//   });

//   it("readFSAs", async () => {
//     let { store, adapter, relic, accounts } = setup;
//     let readAllEvents = await Store.readFSAs(store, adapter, relic.web3, accounts[0]);
//     expect(readAllEvents.length).toBe(6);
//   });
// });

// import { Store } from "../Store";
// import { getSetupAsync } from "../../__mocks__/setup";

// /**
//  * Store throws on bad events
//  */
// describe("Store throws on bad events", () => {
//   let setup: any;

//   beforeAll(async () => {
//     setup = await getSetupAsync();
//   });

// });

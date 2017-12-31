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

//   it("throws error when adapter not provided for payload meta.adapter", async () => {
//     let { store, adapter, relic, accounts } = setup;
//     try {
//       await Store.writeFSA(store, adapter, relic.web3, accounts[0], {
//         type: "test",
//         payload: {
//           key: "value",
//           key2: "value2"
//         },
//         meta: {
//           adapter: "I"
//         }
//       });
//     } catch (e) {
//       expect(e.message).toBe("adapterMap not provided for event.meta.adapter: I");
//     }
//   });

//   it("throws error when invalid payload is string.", async () => {
//     let { store, adapter, relic, accounts } = setup;
//     try {
//       await Store.writeFSA(store, adapter, relic.web3, accounts[0], {
//         type: "test",
//         payload: "INVALID SHAPE",
//         meta: {}
//       });
//     } catch (e) {
//       expect(e.message).toBe("event.payload must be an object, not a string.");
//     }
//   });

//   it("throws error when invalid payload is array.", async () => {
//     let { store, adapter, relic, accounts } = setup;
//     try {
//       await Store.writeFSA(store, adapter, relic.web3, accounts[0], {
//         type: "test",
//         payload: [1, 2, 3],
//         meta: {}
//       });
//     } catch (e) {
//       expect(e.message).toBe("event.payload must be an object, not an array.");
//     }
//   });

//   it("throws error when payload key is to large", async () => {
//     let { store, adapter, relic, accounts } = setup;
//     try {
//       await Store.writeFSA(store, adapter, relic.web3, accounts[0], {
//         type: "test",
//         payload: {
//           REALLY_LARGE_KEY_BIGGER_THAN_BYTES_32_STRING______________________: "value"
//         },
//         meta: {}
//       });
//     } catch (e) {
//       expect(e.message).toBe("payload key to large. does not fit in bytes32 string (S).");
//     }
//   });

//   it("throws error when payload key is address, and value is not valid address", async () => {
//     let { store, adapter, relic, accounts } = setup;
//     try {
//       await Store.writeFSA(store, adapter, relic.web3, accounts[0], {
//         type: "test",
//         payload: {
//           address: "NOT_AN_ADDRESS"
//         },
//         meta: {}
//       });
//     } catch (e) {
//       expect(e.message).toBe(
//         "payload of address type has none address value. NOT_AN_ADDRESS is not a valid address."
//       );
//     }
//   });

//   it("throws error when payload key is address, and value invalid hex: x1E63f28550ae27e0a192d91d073ea4e97dd089b0", async () => {
//     let { store, adapter, relic, accounts } = setup;
//     try {
//       await Store.writeFSA(store, adapter, relic.web3, accounts[0], {
//         type: "test",
//         payload: {
//           address: "x1E63f28550ae27e0a192d91d073ea4e97dd089b0"
//         },
//         meta: {}
//       });
//     } catch (e) {
//       expect(e.message).toBe(
//         "payload of address type has none address value. x1E63f28550ae27e0a192d91d073ea4e97dd089b0 is not a valid address."
//       );
//     }
//   });

//   it("throws error when payload key is address, and value invalid hex: 1E63f28550ae27e0a192d91d073ea4e97dd089b0", async () => {
//     let { store, adapter, relic, accounts } = setup;
//     try {
//       await Store.writeFSA(store, adapter, relic.web3, accounts[0], {
//         type: "test",
//         payload: {
//           address: "1E63f28550ae27e0a192d91d073ea4e97dd089b0"
//         },
//         meta: {}
//       });
//     } catch (e) {
//       expect(e.message).toBe(
//         "payload of address type has none address value. 1E63f28550ae27e0a192d91d073ea4e97dd089b0 is not a valid address."
//       );
//     }
//   });

//   it("throws error when payload key is bytes32, and value is larger than bytes32", async () => {
//     let { store, adapter, relic, accounts } = setup;
//     try {
//       await Store.writeFSA(store, adapter, relic.web3, accounts[0], {
//         type: "test",
//         payload: {
//           bytes32: "REALLY_LARGE_VALUE_BIGGER_THAN_BYTES_32_STRING______________________"
//         },
//         meta: {}
//       });
//     } catch (e) {
//       expect(e.message).toBe(
//         "payload value of type (S) is more than 32 bytes. value length = 68 chars"
//       );
//     }
//   });

//   it("throws error when payload key is bytes32, and value is malformed: '0x000000000000000000000000000000000000000000000000000000000000000-'", async () => {
//     let { store, adapter, relic, accounts } = setup;
//     try {
//       await Store.writeFSA(store, adapter, relic.web3, accounts[0], {
//         type: "test",
//         payload: {
//           bytes32: "0x000000000000000000000000000000000000000000000000000000000000000-"
//         },
//         meta: {}
//       });
//     } catch (e) {
//       expect(e.message).toBe(
//         "payload value of type (S) is more than 32 bytes. value length = 66 chars"
//       );
//     }
//   });

//   it("throws error when payload key is bytes32, and value is malformed...: 000000000000000000000000000000000000000000000000000000000000000A", async () => {
//     let { store, adapter, relic, accounts } = setup;
//     try {
//       await Store.writeFSA(store, adapter, relic.web3, accounts[0], {
//         type: "test",
//         payload: {
//           bytes32: "000000000000000000000000000000000000000000000000000000000000000A"
//         },
//         meta: {}
//       });
//     } catch (e) {
//       expect(e.message).toBe(
//         "payload value of type (S) is more than 32 bytes. value length = 64 chars"
//       );
//     }
//   });

//   it("throws error when payload.type is to big", async () => {
//     let { store, adapter, relic, accounts } = setup;
//     try {
//       await Store.writeFSA(store, adapter, relic.web3, accounts[0], {
//         type: "REALLY_LARGE_VALUE_BIGGER_THAN_BYTES_32_STRING______________________",
//         payload: {
//           bytes32: "000000000000000000000000000000000000000000000000000000000000000A"
//         },
//         meta: {}
//       });
//     } catch (e) {
//       expect(e.message).toBe("fsa.type (S) is more than 32 bytes. value length = 68 chars");
//     }
//   });

// });

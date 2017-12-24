import Relic from "../../transmute-relic";
import { Factory } from "../../Factory";
import { Store } from "../Store";
import { Adapter } from "../Adapter";
import { W3 } from "soltsice";
import { UnsafeEventStoreFactory } from "../../types/UnsafeEventStoreFactory";

import { UnsafeEventStore } from "../../types/UnsafeEventStore";

const cfg = {
  providerUrl: "http://localhost:8545"
};
const relic = new Relic(cfg);

/**
 * UnsafeEventStore test
 */
describe("UnsafeEventStore test", () => {
  let accounts: string[];
  let factory: UnsafeEventStoreFactory;
  let store: UnsafeEventStore;

  const setup = async () => {
    accounts = await relic.getAccounts();
    factory = await Factory.create(Factory.Types.UnsafeEventStoreFactory, relic.web3, accounts[0]);

    let events = await Factory.createStore(factory, relic.web3, accounts[0]);
    expect(events.length).toBe(1);
    expect(events[0].type).toBe("ES_CREATED");

    store = await UnsafeEventStore.At(events[0].payload.address);
  };

  describe("writeFSA supports adapter types", () => {
    // it("throws error when adapter not provided for payload meta.adapter", async () => {
    //   await setup();

    //   let ipfsAdapter = require("../../../../transmute-adapter-ipfs");
    //   let leveldbAdapter = require("../../../../transmute-adapter-leveldb");

    //   let adapterMap: Adapter.IStoreAdapterMap = {

    //   };

    //   try {
    //     await Store.writeFSA(store, adapterMap,  relic.web3, accounts[0], {
    //       type: "test",
    //       payload: {
    //         key: 'value',
    //         key2: 'value2'
    //       },
    //       meta: {
    //         adapter: 'I'
    //       }
    //     });
    //   } catch (e) {
    //     // console.error(e)
    //     expect(e.message).toBe("adapterMap not provided for event.meta.adapter: I");
    //   }
    // });

    it("supports payload meta.adapter and mapper pattern", async () => {
      await setup();

      let ipfsAdapter = require("../../../../transmute-adapter-ipfs");
      let leveldbAdapter = require("../../../../transmute-adapter-leveldb");

      let adapterMap: Adapter.IStoreAdapterMap = {
        I: {
          adapter: ipfsAdapter,
          db: ipfsAdapter.getStorage()
        },
        L: {
          adapter: leveldbAdapter,
          db: leveldbAdapter.getStorage()
        }
      };

      let events = await Store.writeFSA(store, adapterMap, relic.web3, accounts[0], {
        type: "test",
        payload: {
          key: "value",
          key2: "value2"
        },
        meta: {
          adapter: "I"
        }
      });

      // read last event and confirm it is valid
      let lastEvent = (await Store.eventCount(store, relic.web3, accounts[0])) - 1;
      let events2 = await Store.readFSA(store, adapterMap, relic.web3, accounts[0], lastEvent);

      expect(events2.payload).toEqual({
        key: "value",
        key2: "value2"
      });

      expect(events2.meta.adapter).toEqual("I");

      let events3 = await Store.writeFSA(store, adapterMap, relic.web3, accounts[0], {
        type: "test",
        payload: {
          key: "value",
          key2: "value2"
        },
        meta: {
          adapter: "L"
        }
      });
      lastEvent = (await Store.eventCount(store, relic.web3, accounts[0])) - 1;

      let events4 = await Store.readFSA(store, adapterMap, relic.web3, accounts[0], lastEvent);

      expect(events4.payload).toEqual({
        key: "value",
        key2: "value2"
      });
    });
  });

  // describe("writeFSA supports simple types", () => {
  //   it("throws error when invalid payload is string.", async () => {
  //     await setup();
  //     try {
  //       await Store.writeFSA(store, relic.web3, accounts[0], {
  //         type: "test",
  //         payload: "INVALID SHAPE"
  //       });
  //     } catch (e) {
  //       // console.error(e)
  //       expect(e.message).toBe("event.payload must be an object, not a string.");
  //     }
  //   });

  //   it("throws error when invalid payload is array.", async () => {
  //     await setup();
  //     try {
  //       await Store.writeFSA(store, relic.web3, accounts[0], {
  //         type: "test",
  //         payload: [1, 2, 3]
  //       });
  //     } catch (e) {
  //       // console.error(e)
  //       expect(e.message).toBe("event.payload must be an object, not an array.");
  //     }
  //   });

  //   it("throws error when payload key is to large", async () => {
  //     await setup();
  //     try {
  //       await Store.writeFSA(store, relic.web3, accounts[0], {
  //         type: "test",
  //         payload: {
  //           REALLY_LARGE_KEY_BIGGER_THAN_BYTES_32_STRING______________________: "value"
  //         }
  //       });
  //     } catch (e) {
  //       // console.error(e)
  //       expect(e.message).toBe("payload key to large. does not fit in bytes32 string (S).");
  //     }
  //   });

  //   it("throws error when payload key is address, and value is not valid address", async () => {
  //     await setup();
  //     try {
  //       await Store.writeFSA(store, relic.web3, accounts[0], {
  //         type: "test",
  //         payload: {
  //           address: "NOT_AN_ADDRESS"
  //         }
  //       });
  //     } catch (e) {
  //       // console.error(e)
  //       expect(e.message).toBe(
  //         "payload of address type has none address value. NOT_AN_ADDRESS is not a valid address."
  //       );
  //     }
  //   });

  //   it("throws error when payload key is address, and value invalid hex: x1E63f28550ae27e0a192d91d073ea4e97dd089b0", async () => {
  //     await setup();
  //     try {
  //       await Store.writeFSA(store, relic.web3, accounts[0], {
  //         type: "test",
  //         payload: {
  //           address: "x1E63f28550ae27e0a192d91d073ea4e97dd089b0"
  //         }
  //       });
  //     } catch (e) {
  //       // console.error(e)
  //       expect(e.message).toBe(
  //         "payload of address type has none address value. x1E63f28550ae27e0a192d91d073ea4e97dd089b0 is not a valid address."
  //       );
  //     }
  //   });

  //   it("throws error when payload key is address, and value invalid hex: 1E63f28550ae27e0a192d91d073ea4e97dd089b0", async () => {
  //     await setup();
  //     try {
  //       await Store.writeFSA(store, relic.web3, accounts[0], {
  //         type: "test",
  //         payload: {
  //           address: "1E63f28550ae27e0a192d91d073ea4e97dd089b0"
  //         }
  //       });
  //     } catch (e) {
  //       // console.error(e)
  //       expect(e.message).toBe(
  //         "payload of address type has none address value. 1E63f28550ae27e0a192d91d073ea4e97dd089b0 is not a valid address."
  //       );
  //     }
  //   });

  //   it("throws error when payload key is bytes32, and value is larger than bytes32", async () => {
  //     await setup();
  //     try {
  //       await Store.writeFSA(store, relic.web3, accounts[0], {
  //         type: "test",
  //         payload: {
  //           bytes32: "REALLY_LARGE_VALUE_BIGGER_THAN_BYTES_32_STRING______________________"
  //         }
  //       });
  //     } catch (e) {
  //       // console.error(e)
  //       expect(e.message).toBe(
  //         "payload value of type (S) is more than 32 bytes. value length = 68 chars"
  //       );
  //     }
  //   });

  //   it("throws error when payload key is bytes32, and value is malformed: '0x000000000000000000000000000000000000000000000000000000000000000-'", async () => {
  //     await setup();
  //     try {
  //       await Store.writeFSA(store, relic.web3, accounts[0], {
  //         type: "test",
  //         payload: {
  //           bytes32: "0x000000000000000000000000000000000000000000000000000000000000000-"
  //         }
  //       });
  //     } catch (e) {
  //       // console.error(e)
  //       expect(e.message).toBe(
  //         "payload value of type (S) is more than 32 bytes. value length = 66 chars"
  //       );
  //     }
  //   });

  //   it("throws error when payload key is bytes32, and value is malformed...: 000000000000000000000000000000000000000000000000000000000000000A", async () => {
  //     await setup();
  //     try {
  //       await Store.writeFSA(store, relic.web3, accounts[0], {
  //         type: "test",
  //         payload: {
  //           bytes32: "000000000000000000000000000000000000000000000000000000000000000A"
  //         }
  //       });
  //     } catch (e) {
  //       // console.error(e)
  //       expect(e.message).toBe(
  //         "payload value of type (S) is more than 32 bytes. value length = 64 chars"
  //       );
  //     }
  //   });

  //   it("throws error when payload.type is to big", async () => {
  //     await setup();
  //     try {
  //       await Store.writeFSA(store, relic.web3, accounts[0], {
  //         type: "REALLY_LARGE_VALUE_BIGGER_THAN_BYTES_32_STRING______________________",
  //         payload: {
  //           bytes32: "000000000000000000000000000000000000000000000000000000000000000A"
  //         }
  //       });
  //     } catch (e) {
  //       // console.error(e)
  //       expect(e.message).toBe("fsa.type (S) is more than 32 bytes. value length = 68 chars");
  //     }

  //     // expect(fsa.payload.address === '0x1e63f28550ae27e0a192d91d073ea4e97dd089b0')
  //   });

  //   it("supports well formated address payloads", async () => {
  //     await setup();
  //     let events = await Store.writeFSA(store, relic.web3, accounts[0], {
  //       type: "test",
  //       payload: {
  //         address: "0x1e63f28550ae27e0a192d91d073ea4e97dd089b0"
  //       }
  //     });

  //     expect(events[0].payload.address === "0x1e63f28550ae27e0a192d91d073ea4e97dd089b0");
  //   });

  //   it("supports well formated bytes payloads", async () => {
  //     await setup();
  //     let events = await Store.writeFSA(store, relic.web3, accounts[0], {
  //       type: "test",
  //       payload: {
  //         bytes32: "0x000000000000000000000000000000000000000000000000000000000000000A"
  //       }
  //     });
  //     expect(
  //       events[0].payload.bytes32 ===
  //         "0x000000000000000000000000000000000000000000000000000000000000000A"
  //     );
  //   });

  // it("supports simple key value string types", async () => {
  //   await setup();
  //   let events = await Store.writeFSA(store, relic.web3, accounts[0], {
  //     type: "test",
  //     payload: {
  //       key: "value"
  //     }
  //   });
  //   expect(events[0].payload.key === "value");
  // });
  // });
});

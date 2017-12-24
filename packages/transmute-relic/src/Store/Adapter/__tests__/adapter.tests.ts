import { Adapter } from "../Adapter";

/**
 * Adapter test
 */
describe("Adapter test", () => {

  describe("supports adapter map", () => {
    it("works with ipfs and leveldb", async () => {
      let ipfsAdapter = require("../../../../../transmute-adapter-ipfs");
      // let leveldbAdapter = require("../../../../../transmute-adapter-leveldb");

      let adapterMapper: Adapter.IStoreAdapterMap = {
        I: {
          adapter: ipfsAdapter,
          db: ipfsAdapter.getStorage()
        },
        // L: {
        //   adapter: leveldbAdapter,
        //   db: leveldbAdapter.getStorage()
        // }
      };

      let events = [
        {
          type: "TEST_1",
          payload: {
            hello: "world"
          },
          meta: {
            adapter: "I"
          }
        },
        // {
        //   type: "TEST_2",
        //   payload: {
        //     hello: "world"
        //   },
        //   meta: {
        //     adapter: "L"
        //   }
        // }
      ];

      let expectedPackedEvents = [
        {
          type: "TEST_1",
          payload: { multihash: "QmNrEidQrAbxx3FzxNt9E6qjEDZrtvzxUVh47BXm55Zuen" },
          meta: {
            adapter: "I",
            key: "QmNrEidQrAbxx3FzxNt9E6qjEDZrtvzxUVh47BXm55Zuen"
          }
        },
        {
          type: "TEST_2",
          payload: { sha1: "2248ee2fa0aaaad99178531f924bf00b4b0a8f4e" },
          meta: {
            adapter: "L",
            key: "2248ee2fa0aaaad99178531f924bf00b4b0a8f4e"
          }
        }
      ];

      let result = await Adapter.writeEvents(adapterMapper, events);

      expect(result).toEqual(expectedPackedEvents);

      let expectedUnpackedEvents = [
        {
          type: "TEST_1",
          payload: { hello: "world" },
          meta: {
            adapter: "I",
            key: "QmNrEidQrAbxx3FzxNt9E6qjEDZrtvzxUVh47BXm55Zuen"
          }
        },
        {
          type: "TEST_2",
          payload: { hello: "world" },
          meta: {
            adapter: "L",
            key: "2248ee2fa0aaaad99178531f924bf00b4b0a8f4e"
          }
        }
      ];

      let unpackedEvents = await Adapter.readEvents(adapterMapper, expectedPackedEvents);
      expect(unpackedEvents).toEqual(expectedUnpackedEvents);
    });
  });
});

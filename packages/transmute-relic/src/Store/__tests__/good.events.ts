import { Store } from "../Store";
import { getSetupAsync } from "../../__mocks__/setup";

let allEvents = [
  {
    type: "test",
    payload: {
      key: "value"
    },
    meta: {}
  },
  {
    type: "test",
    payload: {
      key: "value",
      key2: "value2"
    },
    meta: {
      adapter: "I"
    }
  },
  {
    type: "test",
    payload: {
      key: "value",
      key2: "value2"
    },
    meta: {
      adapter: "N"
    }
  },
  {
    type: "test",
    payload: {
      address: "0x01000c268181f5d90587392ff67ada1a16393fe4"
    },
    meta: {}
  },
  {
    type: "test",
    payload: {
      bytes32: "0x000000000000000000000000000000000000000000000000000000000000000A"
    },
    meta: {}
  },
  {
    type: "test",
    payload: {
      uint: 0
    },
    meta: {}
  }
];

/**
 * Store good events
 */
describe("Store can read and write events", () => {
  let setup: any;

  beforeAll(async () => {
    setup = await getSetupAsync();
  });

  it("writeFSAs", async () => {
    let { store, adapter, relic, accounts } = setup;
    let writtenEvents = await Store.writeFSAs(store, adapter, relic.web3, accounts[0], allEvents);
    expect(writtenEvents.length).toBe(6);
  });

  it("readFSAs", async () => {
    let { store, adapter, relic, accounts } = setup;
    let readAllEvents = await Store.readFSAs(store, adapter, relic.web3, accounts[0]);
    expect(readAllEvents.length).toBe(6);
  });
});

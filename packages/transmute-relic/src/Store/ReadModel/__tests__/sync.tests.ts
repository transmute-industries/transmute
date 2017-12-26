import { ReadModel } from "../ReadModel";

import { Store } from '../../'
import { getSetupAsync } from "../../__mocks___/store";

import events from "../__mocks__/events";
import { reducer, initialState } from "../__mocks__/reducer";

let state = initialState;
state.contractAddress = "0x1a63f28550ae27e0a192d91d073ea4e97dd089b";
state.readModelStoreKey = `${state.readModelType}:${state.contractAddress}`;

/**
 * ReadModel event tests
 */
describe("ReadModel event tests", () => {
  const Storage = require("node-storage");
  const store = new Storage("./read_model_storage");
  let adapter: any = {
    getItem: (id: string) => {
      return JSON.parse(store.get(id));
    },
    setItem: (id: string, value: any) => {
      return store.put(id, JSON.stringify(value));
    }
  };

  let setup: any;

  beforeAll(async () => {
    setup = await getSetupAsync();
  });

  it("can sync", async () => {
    let { store, adapter, relic, accounts } = setup;
    let writtenEvents = await Store.writeFSAs(store, adapter, relic.web3, accounts[0], events)
    expect(writtenEvents.length).toBe(2)
    let rm = new ReadModel(adapter, reducer, state);
    let newState = await rm.sync(store, adapter, relic.web3, accounts[0])
    expect(rm.state.lastEvent).toBe(1)
  });
});

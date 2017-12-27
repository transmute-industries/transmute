import { ReadModel } from "../ReadModel";

import { Store } from "../../";
import { getSetupAsync } from "../../../__mocks__/setup";

import events from "../__mocks__/events";
import { reducer, initialState } from "../__mocks__/reducer";

let state = initialState;

/**
 * ReadModel event tests
 */
describe("ReadModel event tests", () => {
  const Storage = require("node-storage");
  const db = new Storage("./read_model_storage");
  const rmAdapter: any = {
    getItem: (id: string) => {
      return JSON.parse(db.get(id));
    },
    setItem: (id: string, value: any) => {
      return db.put(id, JSON.stringify(value));
    }
  };

  let setup: any;

  beforeAll(async () => {
    setup = await getSetupAsync();
    state.contractAddress = setup.store.address;
    state.readModelStoreKey = `${state.readModelType}:${state.contractAddress}`;
  });

  it("can sync", async () => {
    let { store, adapter, relic, accounts } = setup;
    let writtenEvents = await Store.writeFSAs(store, adapter, relic.web3, accounts[0], events);
    expect(writtenEvents.length).toBe(2);
    let rm = new ReadModel(rmAdapter, reducer, state);

    let hadChanges = await rm.sync(store, adapter, relic.web3, accounts[0]);
    expect(hadChanges); // expect changes, we have not colled sync yet

    hadChanges = await rm.sync(store, adapter, relic.web3, accounts[0]);
    expect(!hadChanges); // expect no changes, we called sync, and have not written any events

    writtenEvents = await Store.writeFSAs(store, adapter, relic.web3, accounts[0], events);

    hadChanges = await rm.sync(store, adapter, relic.web3, accounts[0]);
    expect(hadChanges); // expect changes, wrote events written any events
  });
});

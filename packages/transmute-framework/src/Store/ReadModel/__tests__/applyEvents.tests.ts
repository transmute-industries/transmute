import { ReadModel } from "../ReadModel";

import { reducer, initialState } from "../__mocks__/reducer";

import events from "../__mocks__/events";

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

  it("initializes successfully", async () => {
    let rm = new ReadModel(adapter, reducer, state);
    expect(rm).toBeDefined();
  });

  it("can applyEvents", async () => {
    let rm = new ReadModel(adapter, reducer, state);
    rm.applyEvents(events);
    expect(rm.state.model.name).toBe("dave");
  });

});

import { ReadModel } from "../ReadModel";

/**
 * ReadModel adapter tests
 */
describe("ReadModel adapter tests", () => {
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

  it("throws when adapter does not implement IReadModelAdapter", async () => {
    try {
      let forgottenType: any = ReadModel;
      let rm = new forgottenType({});
    } catch (e) {
      expect(e.message).toBe(
        "adapter.getItem is not defined. adapter must implement IReadModelAdapter"
      );
    }
  });

  it("throws when reducer is not passed to constructor", async () => {
    try {
      let forgottenType: any = ReadModel;
      let rm = new forgottenType(adapter);
    } catch (e) {
      expect(e.message).toBe("reducer is not defined. pass a reducer to the constructor.");
    }
  });

  it("throws when state is not passwed to constructor", async () => {
    try {
      let forgottenType: any = ReadModel;
      let rm = new forgottenType(adapter, jest.fn());
    } catch (e) {
      expect(e.message).toBe("state is not defined. pass a default state to the constructor.");
    }
  });

  it("throws when state.contractAddress is not defined", async () => {
    try {
      let forgottenType: any = ReadModel;
      let rm = new forgottenType(adapter, jest.fn(), {});
    } catch (e) {
      expect(e.message).toBe(
        "state.contractAddress is not defined. make sure its defined before creating a read model."
      );
    }
  });

  it("throws when state.readModelType is not defined", async () => {
    try {
      let forgottenType: any = ReadModel;
      let rm = new forgottenType(adapter, jest.fn(), {
        contractAddress: "0x"
      });
    } catch (e) {
      expect(e.message).toBe(
        "state.readModelType is not defined. make sure its defined before creating a read model."
      );
    }
  });

  it("throws when state.readModelStoreKey is not defined", async () => {
    try {
      let forgottenType: any = ReadModel;
      let rm = new forgottenType(adapter, jest.fn(), {
        contractAddress: "0x",
        readModelType: "bobo"
      });
    } catch (e) {
      expect(e.message).toBe(
        "state.readModelStoreKey is not defined. make sure its defined before creating a read model."
      );
    }
  });

  it("throws when state.readModelStoreKey is not formatted correctly", async () => {
    try {
      let forgottenType: any = ReadModel;
      let rm = new forgottenType(adapter, jest.fn(), {
        contractAddress: "0x",
        readModelType: "bobo",
        readModelStoreKey: "bob2o:0x"
      });
    } catch (e) {
      expect(e.message).toBe(
        "state.readModelStoreKey is not formatted correctly. it should be bobo:0x"
      );
    }
  });

  it("supports node-storage adapter", async () => {
    let forgottenType: any = ReadModel;
    let reducer = jest.fn();
    let state = {
      contractAddress: "0x",
      readModelType: "bobo",
      readModelStoreKey: "bobo:0x"
    };
    let rm = new forgottenType(adapter, reducer, state);
    expect(rm).toBeDefined();
  });


});

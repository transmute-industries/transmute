let T = require("transmute-framework");

let relic = new T.Relic();

let localStorageAdapter = require("transmute-adapter-local-storage");
let localStorageDB = localStorageAdapter.getStorage();

let factoryReadModelJSON = require("../../EventStoreFactory.ReadModel.json");

const eventStoreAdapter = new T.EventStoreAdapter({
  N: {
    keyName: "sha1",
    adapter: localStorageAdapter,
    db: localStorageDB,
    readIDFromBytes32: bytes32 => {
      return T.Utils.toAscii(bytes32).replace(/\u0000/g, "");
    },
    writeIDToBytes32: id => {
      return id;
    }
  }
});

const readModelAdapter = {
  getItem: id => {
    let item = JSON.parse(localStorageDB.getItem(id));
    return item ? item : factoryReadModelJSON;
  },
  setItem: (id, value) => {
    return localStorageDB.setItem(id, JSON.stringify(value));
  }
};

export { relic, eventStoreAdapter, readModelAdapter, factoryReadModelJSON };

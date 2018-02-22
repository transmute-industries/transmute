let T = require("transmute-framework");
let web3 = require('../../transmute/web3')

let relic = new T.Relic(web3);

let localStorageAdapter = require("transmute-adapter-local-storage");

let localStorageDB = localStorageAdapter.getStorage();


const bs58 = require("bs58");

let ipfsAdapter = require("transmute-adapter-ipfs");


const ipfsConfig = {
  host: 'localhost',
  port: 5001,
  protocol: 'http'
};


let ipfs = ipfsAdapter.getStorage(ipfsConfig);

const eventStoreAdapter = new T.EventStoreAdapter({
  I: {
    keyName: "multihash",
    adapter: ipfsAdapter,
    db: ipfs,
    readIDFromBytes32: bytes32 => {
      return bs58.encode(new Buffer("1220" + bytes32.slice(2), "hex"));
    },
    writeIDToBytes32: id => {
      return "0x" + new Buffer(bs58.decode(id).slice(2)).toString("hex");
    }
  },
});

const readModelAdapter = {
  getItem: id => {
    let item = JSON.parse(localStorageDB.getItem(id));
    return item ? item : null;
  },
  setItem: (id, value) => {
    return localStorageDB.setItem(id, JSON.stringify(value));
  }
};

export { relic, eventStoreAdapter, readModelAdapter };

const T = require("transmute-framework");
const Storage = require("node-storage");

const bs58 = require('bs58')

const ipfsAdapter = require('transmute-adapter-ipfs')
const nodeStorageAdapter = require('transmute-adapter-node-storage')

let ipfs = ipfsAdapter.getStorage()

const db = new Storage("./read_model_storage");
const nodeStorageDB = nodeStorageAdapter.getStorage();

module.exports  = async () => {
  let relic = new T.Relic({
    providerUrl: 'http://localhost:8545'
  });
  T.W3.Default = relic.web3;
  let accounts = await relic.getAccounts();
  const readModelAdapter = {
    getItem: id => {
      return JSON.parse(db.get(id));
    },
    setItem: (id, value) => {
      return db.put(id, JSON.stringify(value));
    }
  };
  const eventStoreAdapter = new T.EventStoreAdapter({
    I: {
        keyName: 'multihash',
        adapter: ipfsAdapter,
        db: ipfs,
        readIDFromBytes32: (bytes32) => {
          return bs58.encode(new Buffer('1220' + bytes32.slice(2), 'hex'))
        },
        writeIDToBytes32: (id) => {
          return '0x' + new Buffer(bs58.decode(id).slice(2)).toString('hex')
        }
      },
  });

  return {
      accounts,
      relic, 
      eventStoreAdapter,
      readModelAdapter
  }
};

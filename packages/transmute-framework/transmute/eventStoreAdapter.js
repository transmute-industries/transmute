const T = require('../');
const bs58 = require('bs58');

let ipfsAdapter = require('transmute-adapter-ipfs');
let nodeStorageAdapter = require('transmute-adapter-node-storage');

let nodeStorageDB = nodeStorageAdapter.getStorage();

const transmuteConfig = require('../src/transmute-config.json');
let ipfs = ipfsAdapter.getStorage(transmuteConfig.minikube.ipfs);

module.exports = new T.EventStoreAdapter({
  I: {
    keyName: 'multihash',
    adapter: ipfsAdapter,
    db: ipfs,
    readIDFromBytes32: bytes32 => {
      return bs58.encode(new Buffer('1220' + bytes32.slice(2), 'hex'));
    },
    writeIDToBytes32: id => {
      return '0x' + new Buffer(bs58.decode(id).slice(2)).toString('hex');
    }
  },
  N: {
    keyName: 'sha1',
    adapter: nodeStorageAdapter,
    db: nodeStorageDB,
    readIDFromBytes32: bytes32 => {
      return T.Utils.toAscii(bytes32).replace(/\u0000/g, '');
    },
    writeIDToBytes32: id => {
      return id;
    }
  }
});

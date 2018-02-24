const T = require('transmute-framework');

const bs58 = require('bs58');

const axios = require('axios');


const { ipfsConfig } = require('./ipfs');

const IPFS = require('ipfs-mini');

const getStorage = config => {
  if (!config) {
    throw new Error(
      'Config required, see https://github.com/SilentCicero/ipfs-mini'
    );
  }
  return new IPFS(config);
};

const getItem = (ipfs, key) => {
  return new Promise((resolve, reject) => {
    ipfs.catJSON(key, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const setItem = (ipfs, value) => {
  return new Promise((resolve, reject) => {
    ipfs.addJSON(value, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const ipfsAdapter = {
  getStorage,
  getItem,
  setItem
};

const getEventStoreAdapterAsync = async () => {
  const ipfs = ipfsAdapter.getStorage({
    ...ipfsConfig
  });

  let response = await axios.get(
    `http://${ipfsConfig.host}:${ipfsConfig.port}/api/v0/id`
  );

  if (!response.data.ID) {
    throw new Error('cannot connect to ipfs');
  }

  const eventStoreAdapter = new T.EventStoreAdapter({
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
    }
  });
  return eventStoreAdapter;
};

module.exports = {
  getEventStoreAdapterAsync
};

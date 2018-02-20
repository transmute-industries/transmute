import * as T from 'transmute-framework';

import bs58 from 'bs58';

let ipfsAdapter = require('transmute-adapter-ipfs');

export const getAdapterAsync = async () => {
  const ipfs = ipfsAdapter.getStorage({
    host: 'ipfs.transmute.network',
    port: 5001,
    protocol: 'http'
  });

  let id = await ipfs.stat('QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG');
  if (id === undefined) {
    throw new Error('Unable to connect to ipfs.');
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

const { getEventStoreAdapterAsync } = require('./eventStoreAdapter');
// const { getReadModelAdapterAsync } = require('./readModelAdapter');

const web3 = require('./web3');
const ipfs = require('./ipfs');

module.exports = {
  ipfs,
  web3,
  getEventStoreAdapterAsync
  // getReadModelAdapterAsync
};

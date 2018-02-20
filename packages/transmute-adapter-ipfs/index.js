const IPFS = require('ipfs-mini');

const getStorage = provider => {
  return new IPFS({
    host: provider.split('//')[1].split(':')[0],
    port: provider.split(':')[2],
    protocol: provider.split('//')[0]
  });
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

module.exports = {
  getStorage,
  getItem,
  setItem
};

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

module.exports = {
  getStorage,
  getItem,
  setItem
};

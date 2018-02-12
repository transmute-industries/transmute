const IPFS = require("ipfs-mini");


const IPFS_API = process.env.IPFS_API;
const HOST = IPFS_API.split("//")[1].split(":")[0];
const PORT = IPFS_API.split(":")[2];

console.log(PORT)


const getStorage = () => {
  return new IPFS({
    host: HOST | "localhost",
    port: PORT | 5001,
    protocol: "http"
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

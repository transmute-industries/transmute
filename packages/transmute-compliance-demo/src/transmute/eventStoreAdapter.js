const T = require("transmute-framework");
const bs58 = require("bs58");

const IPFS_API = process.env.IPFS_API || "http://localhost:5001";
const HOST = IPFS_API.split("//")[1].split(":")[0];
const PORT = IPFS_API.split(":")[2];

const IPFS = require("ipfs-mini");

const getStorage = () => {
  return new IPFS({
    host: HOST,
    port: PORT,
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

const ipfsAdapter = {
  getStorage,
  getItem,
  setItem
};

let ipfs = ipfsAdapter.getStorage();

module.exports = new T.EventStoreAdapter({
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
  }
});

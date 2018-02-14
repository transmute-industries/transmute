var ipfsAPI = require("ipfs-api");

const { IPFS_GATEWAY, IPFS_API, GANACHE_CLI } = require("./env");

const provider = IPFS_API;
const host = provider.split("//")[1].split(":")[0];
const port = provider.split(":")[2];

console.log(provider);
const protocol = "http";
const ipfs = ipfsAPI(host, port, { protocol: protocol });

(async () => {
  let data = await ipfs.id();
  console.log(data);
})();

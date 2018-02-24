const IPFS_GATEWAY =
  process.env.IPFS_GATEWAY || "http://ipfs.transmute.network:8080";
const IPFS_API = process.env.IPFS_API || "http://ipfs.transmute.network:5001";
const GANACHE_CLI =
  process.env.GANACHE_CLI || "http://testrpc.transmute.network:8545";

module.exports = {
  IPFS_GATEWAY,
  IPFS_API,
  GANACHE_CLI
};

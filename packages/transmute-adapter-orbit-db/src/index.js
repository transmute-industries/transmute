const IPFS = require("ipfs");
const OrbitDB = require("orbit-db");
const bs58 = require("bs58");
const Unixfs = require("ipfs-unixfs");
const { DAGNode } = require("ipld-dag-pb");

const {
  CustomTestKeystore,
  createKeypair,
  sign,
  verify
} = require("./CustomTestKeystore");

const ipfsOptions = {
  start: true,
  repo: "./ipfs-repo",
  EXPERIMENTAL: {
    pubsub: true
  },
  config: {
    Addresses: {
      Swarm: [
        "/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star"
      ]
    }
  }
};

const getReadyIPFS = ipfsOptions => {
  const node = new IPFS(ipfsOptions);
  return new Promise((resolve, reject) => {
    node.on("ready", () => {
      resolve(node);
    });
  });
};

const getOrbitDBFromKeypair = async (ipfs, keypair) => {
  return new Promise((resolve, reject) => {
    const keystore = new CustomTestKeystore(keypair);
    // Create OrbitDB instance
    const orbitdb = new OrbitDB(ipfs, "./orbitdb", {
      peerID: keypair.publicKey,
      keystore: keystore
    });
    resolve(orbitdb);
  });
};

class TransmuteAdapterOrbitDB {
  constructor(orbitdb) {
    this.orbitdb = orbitdb;
  }

  async open(address, type, access) {
    this.type = type;
    this.access = access;
    this.db = await this.orbitdb.open(address, {
      // If database doesn't exist, create it
      create: true,
      overwrite: true,
      // Load only the local version of the database,
      // don't load the latest from the network yet
      localOnly: false,
      type: type || "docstore",
      // If "Public" flag is set, allow anyone to write to the database,
      // otherwise only the creator of the database can write
      write: access || ["*"]
    });
    await this.db.load();
  }

  /**
   * Converts bytes32 to ipfs multihash
   * @function
   * @memberof TransmuteAdapterOrbitDB
   * @name bytes32ToMultihash
   * @param {String} hash bytes32 hash of IPFS multihash
   * @returns {String} IPFS multihash of bytes32 hash
   */
  bytes32ToMultihash(hash) {
    return bs58.encode(new Buffer("1220" + hash.slice(2), "hex"));
  }

  /**
   * Convert ipfs multihash to bytes32
   * @function
   * @memberof TransmuteAdapterOrbitDB
   * @name multihashToBytes32
   * @param {String} ipfshash IPFS multihash of bytes32 hash
   * @returns {String} bytes32 hash of IPFS multihash
   */
  multihashToBytes32(ipfshash) {
    return "0x" + new Buffer(bs58.decode(ipfshash).slice(2)).toString("hex");
  }

  async generateMultihash(buffer) {
    const unixFs = new Unixfs("file", buffer);
    return new Promise((resolve, reject) => {
      DAGNode.create(unixFs.marshal(), (err, dagNode) => {
        if (err) reject(err);
        else resolve(dagNode.toJSON().multihash);
      });
    });
  }

  async bufferToContentID(content) {
    let multihash = await this.generateMultihash(content);
    return this.multihashToBytes32(multihash);
  }

  async readJson(key) {
    return (await this.db.get(key))[0].object;
  }

  async writeJson(value) {
    const key = await this.bufferToContentID(
      Buffer.from(JSON.stringify(value))
    );

    await this.db.put({
      _id: key,
      object: value
    });
    return key;
  }
}

module.exports = {
  getOrbitDBFromKeypair,
  ipfsOptions,
  getReadyIPFS,
  TransmuteAdapterOrbitDB,
  CustomTestKeystore,
  createKeypair,
  sign,
  verify
};

/**
 * A module for reading and writing objects to ipfs
 * @module src/decentralized-storage
 */

const ipfsAPI = require("ipfs-api");
const bs58 = require("bs58");
const { DAGNode, DAGLink } = require("ipld-dag-pb");

/** @class TransmuteAdapterIPFS */
module.exports = class TransmuteAdapterIPFS {
  /**
   * Creates a new TransmuteAdapterIPFS
   * @constructor
   * @memberof TransmuteAdapterIPFS
   * @param {Object} config Config object requiring host, port, and protocol
   */
  constructor(config) {
    this.ipfs = ipfsAPI(config);
  }

  /**
   * Reads object from IPFS
   * @function
   * @memberof TransmuteAdapterIPFS
   * @name bytes32ToMultihash
   * @param {String} hash bytes32 hash of IPFS multihash
   * @returns {String} IPFS multihash of bytes32 hash
   */
  bytes32ToMultihash(hash) {
    return bs58.encode(new Buffer("1220" + hash.slice(2), "hex"));
  }

  /**
   * Reads object from IPFS
   * @function
   * @memberof TransmuteAdapterIPFS
   * @name multihashToBytes32
   * @param {String} ipfshash IPFS multihash of bytes32 hash
   * @returns {String} bytes32 hash of IPFS multihash
   */
  multihashToBytes32(ipfshash) {
    return "0x" + new Buffer(bs58.decode(ipfshash).slice(2)).toString("hex");
  }

  /**
   * Returns identity of peer
   * @function
   * @memberof TransmuteAdapterIPFS
   * @name healthy
   * @returns {Object} Peer identity
   */
  healthy() {
    return this.ipfs.id();
  }

  /**
   * Writes and object to IPFS
   * @function
   * @memberof TransmuteAdapterIPFS
   * @name writeObject
   * @param {Object} obj Object being written
   * @returns {String} IPFS multihash of object converted to bytes32
   */
  async writeBuffer(content) {
    const dagNodes = await this.ipfs.files.add(Buffer.from(content));
    const keyMultihash = dagNodes[0].hash;
    const keyBytes32ID = this.multihashToBytes32(keyMultihash);
    return keyBytes32ID;
  }

  /**
   * Reads object from IPFS
   * @function
   * @memberof TransmuteAdapterIPFS
   * @name readObject
   * @param {String} multihash IPFS multihash of object converted to bytes32
   * @returns {Object} Object stored in IPFS multihash
   */
  async readBuffer(bytes32ID) {
    const multihash = this.bytes32ToMultihash(bytes32ID);
    const dagNodes = await this.ipfs.files.get(multihash);
    return dagNodes[0].content;
  }

  // todo: add jsdoc
  bufferToContentID(content) {
    return new Promise(async (resolve, reject) => {
      let dagNodes = await this.ipfs.files.add(Buffer.from(content), {
        onlyHash: true
      });
      resolve(this.multihashToBytes32(dagNodes[0].hash));
    });
  }

  async readJson(cid) {
    return JSON.parse((await this.readBuffer(cid)).toString());
  }

  async writeJson(data) {
    return this.writeBuffer(JSON.stringify(data));
  }
};

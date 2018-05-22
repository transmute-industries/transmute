/**
 * A module for reading and writing objects to ipfs
 * @module src/decentralized-storage
 */

const ipfsAPI = require('ipfs-api');
const bs58 = require('bs58');

/** @class TransmuteIpfsAdapter */
module.exports = class TransmuteIpfsAdapter {
  /**
   * Creates a new TransmuteIpfsAdapter
   * @constructor
   * @memberof TransmuteIpfsAdapter
   * @param {Object} config Config object requiring host, port, and protocol
   */
  constructor(config) {
    this.ipfs = ipfsAPI(config);
  }

  /**
   * Returns identity of peer
   * @function
   * @memberof TransmuteIpfsAdapter
   * @name healthy
   * @returns {Object} Peer identity
   */
  healthy() {
    return this.ipfs.id();
  }

  /**
   * Writes and object to IPFS
   * @function
   * @memberof TransmuteIpfsAdapter
   * @name writeObject
   * @param {Object} obj Object being written
   * @returns {String} IPFS multihash of object
   */
  async writeObject(obj) {
    return this.ipfs.object.put({
      Data: new Buffer(JSON.stringify(obj)),
      Links: []
    });
  }

  /**
   * Reads object from IPFS
   * @function
   * @memberof TransmuteIpfsAdapter
   * @name readObject
   * @param {String} multihash IPFS multihash of object
   * @returns {Object} Object stored in IPFS multihash
   */
  async readObject(multihash) {
    let data = (await this.ipfs.object.get(multihash)).data.toString();
    return JSON.parse(data);
  }

  /**
   * Reads object from IPFS
   * @function
   * @memberof TransmuteIpfsAdapter
   * @name bytes32ToMultihash
   * @param {String} hash bytes32 hash of IPFS multihash
   * @returns {String} IPFS multihash of bytes32 hash
   */
  bytes32ToMultihash(hash) {
    return bs58.encode(new Buffer('1220' + hash.slice(2), 'hex'));
  }

  /**
   * Reads object from IPFS
   * @function
   * @memberof TransmuteIpfsAdapter
   * @name multihashToBytes32
   * @param {String} ipfshash IPFS multihash of bytes32 hash
   * @returns {String} bytes32 hash of IPFS multihash
   */
  multihashToBytes32(ipfshash) {
    return '0x' + new Buffer(bs58.decode(ipfshash).slice(2)).toString('hex');
  }
};

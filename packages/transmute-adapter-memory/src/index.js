const bs58 = require("bs58");
const Unixfs = require("ipfs-unixfs");
const { DAGNode } = require("ipld-dag-pb");

class TransmuteAdaperMemory {
  constructor(db) {
    this.db = db || {};
  }
  /**
   * Converts bytes32 to ipfs multihash
   * @function
   * @memberof TransmuteAdaperMemory
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
   * @memberof TransmuteAdaperMemory
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
    return this.db[key];
  }

  async writeJson(value) {
    const key = await this.bufferToContentID(
      Buffer.from(JSON.stringify(value))
    );
    this.db[key] = value;
    return key;
  }
}

module.exports = TransmuteAdaperMemory;

/* eslint-disable class-methods-use-this */
const bs58 = require('bs58');
const Unixfs = require('ipfs-unixfs');
const { DAGNode } = require('ipld-dag-pb');

module.exports = class TransmuteAdapterFirebaseRTDB {
  constructor(db, path) {
    this.db = db;
    this.path = path;
  }

  multihashToBytes32(ipfshash) {
    return `0x${Buffer.from(bs58.decode(ipfshash).slice(2)).toString('hex')}`;
  }

  async generateMultihash(buffer) {
    const unixFs = new Unixfs('file', buffer);
    return new Promise((resolve, reject) => {
      DAGNode.create(unixFs.marshal(), (err, dagNode) => {
        if (err) reject(err);
        else resolve(dagNode.toJSON().multihash);
      });
    });
  }

  async bufferToContentID(content) {
    const multihash = await this.generateMultihash(content);
    return this.multihashToBytes32(multihash);
  }

  readJson(key) {
    return this.db
      .ref(`${this.path}${key}`)
      .once('value')
      .then(data => data.val());
  }

  async writeJson(value) {
    const key = await this.bufferToContentID(
      Buffer.from(JSON.stringify(value)),
    );
    return this.db
      .ref(this.path)
      .child(key)
      .set(value)
      .then(() => key);
  }
};

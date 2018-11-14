// const sodiumExtensions = require('../../sodiumExtensions');
// const openpgpExtensions = require('../../openpgpExtensions');
const ellipticExtensions = require('../../ellipticExtensions');

const { verifyDIDSignature } = require('../../did');

class SignatureStore {
  constructor(adapter, resolver) {
    this.adapter = adapter;
    this.resolver = resolver;
    this.objectIndex = {};
    this.signatureIndex = {};
  }

  async add({ object, signature, meta }) {
    const objectID = await this.adapter.writeJson(object);
    const signatureID = await this.adapter.writeJson(signature);
    const storeObject = {
      object,
      signature,
      meta,
    };

    this.objectIndex[objectID] = storeObject;
    this.signatureIndex[signatureID] = storeObject;

    return {
      objectID,
      signatureID,
    };
  }

  async getByObjectID(objectID) {
    return this.objectIndex[objectID];
  }

  async getBySignatureID(signatureID) {
    return this.signatureIndex[signatureID];
  }

  async verify(object, signature, meta) {
    if (meta.kid.indexOf('did:') === 0) {
      const did = meta.kid.split('#')[0];
      const doc = await this.resolver.resolve(did);
      return verifyDIDSignature(object, signature, meta, doc);
    }
    throw new Error('cannot verify a signature without a did in kid.');
  }
}

module.exports = SignatureStore;

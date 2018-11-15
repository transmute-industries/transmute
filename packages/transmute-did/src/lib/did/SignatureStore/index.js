// const sodiumExtensions = require('../../sodiumExtensions');
// const openpgpExtensions = require('../../openpgpExtensions');
// const ellipticExtensions = require('../../ellipticExtensions');

class SignatureStore {
  constructor(adapter, resolver, verifyDIDSignature, kidTransform) {
    this.adapter = adapter;
    this.resolver = resolver;
    this.verifyDIDSignature = verifyDIDSignature;
    this.kidTransform = kidTransform;
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
      return this.verifyDIDSignature(object, signature, meta, doc, this.kidTransform);
    }
    throw new Error('cannot verify a signature without a did in kid.');
  }
}

module.exports = SignatureStore;

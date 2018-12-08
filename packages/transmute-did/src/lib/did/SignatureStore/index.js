class SignatureStore {
  constructor(adapter, resolver, verifyDIDSignature) {
    this.adapter = adapter;
    this.resolver = resolver;
    this.verifyDIDSignature = verifyDIDSignature;
    this.signatureIndex = {};
  }

  async add({ object, signature, meta }) {
    const storeObject = {
      object,
      signature,
      meta,
    };

    const signatureID = await this.adapter.writeJson(storeObject);

    this.signatureIndex[signatureID] = storeObject;

    return {
      signatureID,
    };
  }

  async getBySignatureID(signatureID) {
    if (!this.signatureIndex[signatureID]) {
      this.signatureIndex[signatureID] = await this.adapter.readJson(signatureID);
    }
    return this.signatureIndex[signatureID];
  }

  async verify(object, signature, meta) {
    if (meta.kid.indexOf('did:') === 0) {
      const did = meta.kid.split('#')[0];
      const doc = await this.resolver.resolve(did);
      return this.verifyDIDSignature(object, signature, meta, doc);
    }
    throw new Error('cannot verify a signature without a did in kid.');
  }
}

module.exports = SignatureStore;

const { verifySignedLinkedData, verifyDIDSignatureWithResolver } = require('./signatureMethods');

class SignatureStore {
  constructor(adapter, resolver) {
    this.adapter = adapter;
    this.resolver = resolver;
  }

  async add(signedLinkedData) {
    const contentID = await this.adapter.writeJson(signedLinkedData);
    return {
      contentID,
    };
  }

  async getSignedLinkedDataByContentID(contentID) {
    const signedLinkedData = await this.adapter.readJson(contentID);
    const verified = await verifySignedLinkedData({
      signedLinkedData,
      resolver: this.resolver,
      verifyDIDSignatureWithResolver,
    });
    return {
      signedLinkedData,
      verified,
    };
  }
}

module.exports = SignatureStore;

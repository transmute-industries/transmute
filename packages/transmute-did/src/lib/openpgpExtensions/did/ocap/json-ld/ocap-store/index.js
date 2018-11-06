const { openpgpSignJson, openpgpVerifyJson } = require('../index');

const findKey = (kid, list) => {
  for (let i = 0; i < list.length; i++) {
    const key = list[i];
    if (key.id === kid) {
      return key;
    }
  }
  return null;
};

module.exports = class OCAPStore {
  constructor(resolver) {
    this.caps = {};
    this.verifications = 0;
    this.resolver = resolver;
  }

  async add(cap) {
    // console.log('only store capabilities signed by me', cap);

    const capCreatorDID = cap.signature.creator.split('#')[0];
    const creatorDIDDoc = this.resolver(capCreatorDID);

    const key = findKey(cap.signature.creator, creatorDIDDoc.publicKey);
    // console.log(key.publicKeyPem);

    if (await openpgpVerifyJson(cap, key.publicKeyPem)) {
      this.verifications += 1;
      this.caps[cap.id] = cap;
      return true;
    }

    return false;
  }
};

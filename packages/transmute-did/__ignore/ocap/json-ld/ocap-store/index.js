const { openpgpVerifyJson } = require('../index');

const findKey = (kid, list) => {
  for (let i = 0; i < list.length; i += 1) {
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

  async verifyCap(cap) {
    const capCreatorDID = cap.signature.creator.split('#')[0];
    const creatorDIDDoc = this.resolver(capCreatorDID);

    const key = findKey(cap.signature.creator, creatorDIDDoc.publicKey);
    return openpgpVerifyJson(cap, key.publicKeyPem);
  }

  async add(cap) {
    if (await this.verifyCap(cap)) {
      this.verifications += 1;
      this.caps[cap.id] = cap;
      return true;
    }

    return false;
  }

  async verifyChain(proclamation) {
    let searching = true;
    let cap = this.caps[proclamation];

    const capChain = [];

    while (searching) {
      capChain.push(cap);

      if (cap.parent === undefined) {
        searching = false;
      } else {
        cap = this.caps[cap.parent];
      }
    }
    let revokedFlag = false;
    capChain.forEach((chainCap) => {
      if (chainCap.revoked) {
        revokedFlag = true;
      }
      if (!this.verifyCap(chainCap)) {
        throw new Error(`Capability not valid! ${chainCap.id}`);
      }
    });

    return !revokedFlag;
  }

  async verifyInvocation(invoc) {
    return this.verifyChain(invoc.proclamation);
  }

  async revokeCap(revokedCap) {
    if (await this.verifyCap(revokedCap.cap)) {
      const capCreatorDID = revokedCap.signature.creator.split('#')[0];
      const creatorDIDDoc = this.resolver(capCreatorDID);
      const key = findKey(revokedCap.signature.creator, creatorDIDDoc.publicKey);
      if (await openpgpVerifyJson(revokedCap, key.publicKeyPem)) {
        this.caps[revokedCap.cap.id] = revokedCap;
      }
    } else {
      throw new Error('Capibility is not valid');
    }
  }
};

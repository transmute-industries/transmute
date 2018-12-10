const _ = require('lodash');

const pack = require('../../../package.json');

const sodiumExtensions = require('../cryptoSuites/sodiumExtensions');

const schema = require('../../json-schemas');

const {
  constructDIDPublicKeyID,
  publicKeyKIDPrefix,
  verifyDIDSignatureWithResolver,
  createSignedLinkedData,
  verifySignedLinkedData,
  signObjectWithKeypair,
} = require('../signatureMethods');

//   eslint-disable-next-line
const { sha3_256 } = require('js-sha3');

const constructPublicKeysProperty = (did, keystore) => {
  const allPublicKeys = _.values(keystore);
  const onlyPublicKeys = _.filter(
    allPublicKeys,
    key => key.meta && key.meta.did && key.meta.did.publicKey,
  );
  return onlyPublicKeys.map(key => ({
    id: constructDIDPublicKeyID(did, key.kid),
    type: key.meta.did.signatureType,
    owner: did,
    revocations: key.meta.did.revocations,
    [key.meta.did.publicKeyType]: key.data.publicKey,
  }));
};

const constructAuthenticationProperty = (did, keystore) => {
  const allPublicKeys = _.values(keystore);
  const onlyAuthentricationKeys = _.filter(
    allPublicKeys,
    key => key.meta && key.meta.did && key.meta.did.authentication,
  );
  return onlyAuthentricationKeys.map(key => ({
    publicKey: constructDIDPublicKeyID(did, key.kid),
    type: key.meta.did.signatureType,
  }));
};

class TransmuteDIDWallet {
  constructor(walletData) {
    this.data = walletData;
    this.didCache = {};
    this.resolver = {
      resolve: did => Promise.resolve(this.didCache[did]),
    };
  }

  async addKey(data, type, meta) {
    let kid;
    const { keystore } = this.data;
    switch (type) {
      case 'symmetric':
      case 'shamir-share':
        kid = sha3_256(data);
        break;
      case 'assymetric':
        kid = sha3_256(data.publicKey);
        break;
      default:
        throw new Error('Unknown key type.');
    }
    keystore[kid] = {
      kid,
      data,
      type,
      meta,
    };
  }

  async encrypt(passphrase) {
    this.data = {
      ...this.data,
      keystore: await sodiumExtensions.encryptJson({
        data: this.data.keystore,
        key: await sodiumExtensions.generateSymmetricKeyFromPasswordAndSalt({
          password: passphrase,
          salt: this.data.salt,
        }),
      }),
    };
  }

  async decrypt(passphrase) {
    this.data = {
      ...this.data,
      keystore: await sodiumExtensions.decryptJson({
        data: this.data.keystore,
        key: await sodiumExtensions.generateSymmetricKeyFromPasswordAndSalt({
          password: passphrase,
          salt: this.data.salt,
        }),
      }),
    };
  }

  async generateDIDRevocationCertificate({ did, proofSet }) {
    const result = await this.createSignedLinkedData({
      data: {
        '@context': 'https://w3id.org/identity/v1',
        did,
        message: `This signed json object serves as a revocation certificate for ${did}. See https://docs.transmute.industries/did/revocation for more information.`,
      },
      proofSet,
    });

    return {
      schema: schema.schemaToURI(schema.schemas.didRevocationCertSchema),
      data: result.data,
    };
  }

  async signObject({ obj, kid, password }) {
    const justTheHash = kid.split(`#${publicKeyKIDPrefix}`)[1];

    if (justTheHash === undefined) {
      throw new Error(`kid must be of the format: did#${publicKeyKIDPrefix}...`);
    }

    const keypair = this.data.keystore[justTheHash];

    if (!keypair) {
      throw new Error(justTheHash);
    }
    return signObjectWithKeypair({
      keypair,
      obj,
      kid,
      password,
    });
  }

  async createSignedLinkedData({ data, proofSet, proofChain }) {
    return createSignedLinkedData({
      data,
      proofSet,
      proofChain,
      signObject: this.signObject.bind(this),
    });
  }

  async verifySignedLinkedData({ signedLinkedData, resolver }) {
    return verifySignedLinkedData({
      signedLinkedData,
      verifyDIDSignatureWithResolver,
      resolver: resolver || this.resolver,
    });
  }

  async toDIDDocument({ did, proofSet, cacheLocal }) {
    if (!proofSet) {
      throw new Error('A proofSet is required.');
    }

    const publicKey = await constructPublicKeysProperty(did, this.data.keystore);
    const authentication = await constructAuthenticationProperty(did, this.data.keystore);

    const doc = {
      '@context': 'https://w3id.org/did/v1',
      id: did,
      publicKey,
      authentication,
    };

    const result = await this.createSignedLinkedData({
      data: doc,
      proofSet,
    });

    if (cacheLocal) {
      this.didCache[result.data.id] = result.data;
    }

    return {
      schema: schema.schemaToURI(schema.schemas.didDocument),
      data: result.data,
    };
  }
}

const createWallet = async () => new TransmuteDIDWallet({
  version: pack.version,
  salt: await sodiumExtensions.generateSalt(),
  keystore: {},
});

module.exports = {
  TransmuteDIDWallet,
  createWallet,
  constructDIDPublicKeyID,
};

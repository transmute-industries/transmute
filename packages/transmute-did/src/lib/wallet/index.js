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

const getPrimaryKidForDid = (did, keystore) => {
  const primaryKeys = Object.values(keystore)
    .filter(key => key.meta && key.meta.did && key.meta.did.primaryKeyOf === did);
  if (primaryKeys.length > 1) {
    throw new Error('More than one primary key was found');
  }
  if (primaryKeys.length < 1) {
    throw new Error('No primary key was found');
  }
  return primaryKeys[0].kid;
};

const constructPublicKeysProperty = (did, keystore) => {
  const primaryKID = getPrimaryKidForDid(did, keystore);
  const orderedPublicKeys = Object.values(keystore)
    .filter(key => key.meta && key.meta.did && key.meta.did.publicKey)
    // Primary key first
    .sort((key1, key2) => {
      if (key1.kid === primaryKID) {
        return -1;
      }
      if (key2.kid === primaryKID) {
        return 1;
      }
      return 0;
    })
    .map((key) => {
      const publicKey = {
        id: constructDIDPublicKeyID(did, key.kid),
        type: key.meta.did.signatureType,
        owner: did,
        revocations: key.meta.did.revocations,
        [key.meta.did.publicKeyType]: key.data.publicKey,
      };

      if (!publicKey.revocations) {
        delete publicKey.revocations;
      }
      return publicKey;
    });

  return orderedPublicKeys;
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

  async revoke({ did, kid, proofSet }) {
    let index = kid;
    if (_.find(proofSet, p => p.kid.indexOf(kid) !== -1)) {
      throw new Error('Cannot revoke a key in a proofSet.');
    }
    if (index.indexOf(publicKeyKIDPrefix) !== -1) {
      // eslint-disable-next-line
      index = kid.split(`#${publicKeyKIDPrefix}`)[1];
    }
    delete this.data.keystore[index];
    await this.toDIDDocument({
      did,
      proofSet,
      cacheLocal: true,
    });
  }

  async toDIDDocumentByTag({ did, tag }) {
    const filteredKeystore = Object.values(this.data.keystore)
      .filter(key => key.meta.tags.includes(tag))
      .reduce((acc, key) => Object.assign(acc, {
        [key.kid]: key,
      }), {});
    const publicKey = await constructPublicKeysProperty(did, filteredKeystore);
    const authentication = await constructAuthenticationProperty(did, filteredKeystore);

    const doc = {
      '@context': 'https://w3id.org/did/v1',
      id: did,
      publicKey,
      authentication,
    };

    return {
      schema: schema.schemaToURI(schema.schemas.didDocument),
      data: doc,
    };
  }

  async toDIDDocument({ did, proofSet, cacheLocal }) {
    const publicKey = await constructPublicKeysProperty(did, this.data.keystore);
    const authentication = await constructAuthenticationProperty(did, this.data.keystore);

    let doc = {
      '@context': 'https://w3id.org/did/v1',
      id: did,
      publicKey,
      authentication,
    };

    if (proofSet) {
      doc = (await this.createSignedLinkedData({
        data: doc,
        proofSet,
      })).data;
    }

    if (cacheLocal) {
      this.didCache[doc.id] = doc;
    }

    return {
      schema: schema.schemaToURI(schema.schemas.didDocument),
      data: doc,
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
  getPrimaryKidForDid,
};

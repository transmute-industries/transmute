const _ = require('lodash');

const pack = require('../../../package.json');

const didLib = require('../did');
const sodiumExtensions = require('../sodiumExtensions');
const openpgpExtensions = require('../openpgpExtensions');
const ellipticExtensions = require('../ellipticExtensions');

//   eslint-disable-next-line
const { sha3_256 } = require('js-sha3');

const guessKeyType = (key) => {
  if (key.meta.version.indexOf('openpgp') === 0) {
    return 'openpgp';
  }
  if (key.meta.version.indexOf('libsodium-wrappers') === 0) {
    return 'libsodium-wrappers';
  }
  if (key.meta.version.indexOf('elliptic') === 0) {
    return 'elliptic';
  }

  throw new Error('unguessable key type');
};

const requireKIDinPublicKeys = (kid, publicKeys) => _.some(publicKeys, key => key.id === kid);

const constructPublicKeysProperty = (did, keystore) => {
  const allPublicKeys = _.values(keystore);
  const onlyPublicKeys = _.filter(
    allPublicKeys,
    key => key.meta && key.meta.did && key.meta.did.publicKey,
  );
  return onlyPublicKeys.map(key => ({
    id: `${did}#${key.kid}`,
    type: key.meta.did.signatureType,
    owner: did,
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
    publicKey: `${did}#${key.kid}`,
    type: key.meta.did.signatureType,
  }));
};

class TransmuteDIDWallet {
  constructor(walletData) {
    this.data = walletData;
  }

  async addKey(data, type, meta) {
    let kid;
    const { keystore } = this.data;
    switch (type) {
      case 'symmetric':
        kid = sha3_256(data);
        break;
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

  async signObject({
    obj, kid, passphrase, asDIDByKID, asDIDByKIDPassphrase, overwriteKID,
  }) {
    const keypair = this.data.keystore[kid];
    const guessedType = guessKeyType(keypair);
    const payload = JSON.stringify(obj);
    let signature;
    let doc = {};

    // this will first generate a did document
    // from the keystore with asDIDByKID as the owner
    // this is a good way of ensuring a signature is traceable to a did
    if (asDIDByKID) {
      const result = await this.toDIDDocument(asDIDByKID, asDIDByKIDPassphrase);
      //   eslint-disable-next-line
      doc = result.object;
      if (!requireKIDinPublicKeys(`${doc.id}#${kid}`, doc.publicKey)) {
        throw new Error('kid is not listed in did document. Cannot sign asDIDByKID');
      }
    }

    switch (guessedType) {
      case 'openpgp':
        signature = await openpgpExtensions.cryptoHelpers.signDetached(
          payload,
          keypair.data.privateKey,
          passphrase,
        );
        break;

      case 'libsodium-wrappers':
        signature = await sodiumExtensions.signDetached({
          message: payload,
          privateKey: keypair.data.privateKey,
        });
        break;

      case 'elliptic':
        signature = await ellipticExtensions.sign(payload, keypair.data.privateKey);
        break;

      default:
        throw new Error('Unknown key type. Cannot sign did document');
    }

    const kid2 = overwriteKID || (doc.id ? `${doc.id}#${kid}` : kid);

    const meta = {
      version: `${guessedType}@${pack.dependencies[guessedType]}`,
      kid: kid2,
    };

    return {
      object: obj,
      signature,
      meta,
    };
  }

  async toDIDDocument(ownerKID, passphrase) {
    const masterKeypair = this.data.keystore[ownerKID];

    if (!masterKeypair || !masterKeypair.data.privateKey) {
      throw new Error('Cannot create a DID without a private key. Invalid KID');
    }

    const guessedType = await guessKeyType(masterKeypair);

    if (guessedType === 'openpgp' && passphrase === undefined) {
      throw new Error('Passphrase is required to sign with openpgp.');
    }
    const did = await didLib.publicKeyToDID(guessedType, masterKeypair.data.publicKey);
    const publicKey = await constructPublicKeysProperty(did, this.data.keystore);
    const authentication = await constructAuthenticationProperty(did, this.data.keystore);

    const doc = {
      '@context': 'https://w3id.org/did/v1',
      id: did,
      publicKey,
      authentication,
    };

    //   eslint-disable-next-line
    const { object, signature, meta } = await this.signObject({
      obj: doc,
      kid: ownerKID,
      passphrase,
    });
    return { object, signature, meta };
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
};

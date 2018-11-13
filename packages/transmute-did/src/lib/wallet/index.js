const _ = require('lodash');

const pack = require('../../../package.json');

const didLib = require('../did');
const sodiumExtensions = require('../sodiumExtensions');
const openpgpExtensions = require('../openpgpExtensions');

//   eslint-disable-next-line
const { sha3_256 } = require('js-sha3');

const guessKeyType = (key) => {
  if (key.meta.version.indexOf('openpgp') === 0) {
    return 'openpgp';
  }
  throw new Error('unguessable key type');
};

const signDIDDocument = async (keypair, json, passphrase) => {
  const guessedType = guessKeyType(keypair);
  const payload = JSON.stringify(json);
  let signature;

  switch (guessedType) {
    case 'openpgp':
      signature = await openpgpExtensions.cryptoHelpers.signDetached(
        payload,
        keypair.data.privateKey,
        passphrase,
      );
      break;
    default:
      throw new Error('Unknown key type. Cannot sign did document');
  }

  return signature;
};

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

    const signature = await signDIDDocument(masterKeypair, doc, passphrase);

    return { doc, signature };
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

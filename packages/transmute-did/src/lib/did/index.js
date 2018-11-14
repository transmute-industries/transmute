const { keccak256 } = require('js-sha3');
const _ = require('lodash');

const openpgpExtensions = require('../openpgpExtensions');
const ethereumExtensions = require('../ethereumExtensions');
const ellipticExtensions = require('../ellipticExtensions');
const sodiumExtensions = require('../sodiumExtensions');

const publicKeyToDID = (type, publicKey) => {
  switch (type) {
    case 'openpgp':
      return openpgpExtensions.did.armoredKeytoDID(publicKey);
    case 'ethereum':
      return `did:eth:${ethereumExtensions.publicKeyToAddress(publicKey)}`;
    case 'orbitdb':
      return `did:orbitdb:0x${keccak256(publicKey)}`;
    default:
      throw new Error('Unknown key type');
  }
};

const getPublicKeyFromDIDDocByKID = (doc, kid) => {
  const key = _.find(doc.publicKey, key => key.id === kid);
  if (key.publicKeyPem) {
    return key.publicKeyPem;
  }
  if (key.publicKeyHex) {
    return key.publicKeyHex;
  }
};

const guessKeyType = (meta) => {
  if (meta.version.indexOf('openpgp') === 0) {
    return 'openpgp';
  }
  if (meta.version.indexOf('libsodium-wrappers') === 0) {
    return 'libsodium-wrappers';
  }
  if (meta.version.indexOf('elliptic') === 0) {
    return 'elliptic';
  }

  throw new Error('unguessable key type');
};

const verifyDIDSignature = (object, signature, meta, doc) => {
  const keyType = guessKeyType(meta);
  const publicKey = getPublicKeyFromDIDDocByKID(doc, meta.kid);

  switch (keyType) {
    case 'elliptic':
      return ellipticExtensions.verify(JSON.stringify(object), signature, publicKey);
    case 'openpgp':
      return openpgpExtensions.cryptoHelpers.verifyDetached(
        JSON.stringify(object),
        signature,
        publicKey,
      );
    case 'libsodium-wrappers':
      return sodiumExtensions.verifyDetached({
        message: JSON.stringify(object),
        signature,
        publicKey,
      });

    default:
      throw new Error('Unknown key type');
  }
};

module.exports = {
  publicKeyToDID,
  verifyDIDSignature,
};

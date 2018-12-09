const _ = require('lodash');
const stringify = require('json-stringify-deterministic');

const openpgpExtensions = require('../cryptoSuites/openpgpExtensions');
const ethereumExtensions = require('../cryptoSuites/ethereumExtensions');
const ellipticExtensions = require('../cryptoSuites/ellipticExtensions');
const sodiumExtensions = require('../cryptoSuites/sodiumExtensions');

const { didMethods } = require('./constants');

const SignatureStore = require('./SignatureStore');

const publicKeyKIDPrefix = 'kid=';
const constructDIDPublicKeyID = (did, kid) => `${did}#${publicKeyKIDPrefix}${kid}`;

const publicKeyToDID = async (type, publicKey) => {
  switch (type) {
    case 'openpgp':
      return `did:${
        didMethods.OPENPGP
      }:${await openpgpExtensions.cryptoHelpers.armoredKeytoFingerprintHex(publicKey)}`;
    case 'ethereum':
      return `did:${didMethods.ETHEREUM}:${await ethereumExtensions.publicKeyToAddress(publicKey)}`;
    case 'orbitdb':
      return `did:${didMethods.ORBITDB}:${publicKey}`;
    default:
      throw new Error('Unknown key type');
  }
};

const getPublicKeyFromDIDDocByKID = (doc, kid) => {
  const key = _.find(doc.publicKey, k => k.id === kid);

  if (!key) {
    throw new Error(`No key exists in doc for kid: ${kid}`);
  }
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
  let publicKey;
  try {
    publicKey = getPublicKeyFromDIDDocByKID(doc, meta.kid);
  } catch (e) {
    throw new Error('Public Key with kid does not exist in document.');
  }

  switch (keyType) {
    case 'elliptic':
      return ellipticExtensions.verify(stringify(object), signature, publicKey);
    case 'openpgp':
      return openpgpExtensions.cryptoHelpers.verifyDetached(
        stringify(object),
        signature,
        publicKey,
      );
    case 'libsodium-wrappers':
      return sodiumExtensions.verifyDetached({
        message: stringify(object),
        signature,
        publicKey,
      });

    default:
      throw new Error('Unknown key type');
  }
};

const verifyDIDSignatureWithResolver = async ({
  object, signature, meta, resolver,
}) => {
  const did = meta.kid.split('#')[0];
  const doc = await resolver.resolve(did);
  if (doc.id !== did) {
    throw new Error('DID is not valid. Document ID does not match DID.');
  }
  return verifyDIDSignature(object, signature, meta, doc);
};

module.exports = {
  publicKeyToDID,
  verifyDIDSignature,
  verifyDIDSignatureWithResolver,
  SignatureStore,
  constructDIDPublicKeyID,
  publicKeyKIDPrefix,
};

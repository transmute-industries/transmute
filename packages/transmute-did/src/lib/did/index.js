const _ = require('lodash');

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

const verifyDIDSignature = (object, signature, meta, doc, kidTransform) => {
  const keyType = guessKeyType(meta);
  const kid2 = kidTransform ? kidTransform(meta.kid) : meta.kid;

  let publicKey;
  try {
    publicKey = getPublicKeyFromDIDDocByKID(doc, kid2);
  } catch (e) {
    throw new Error('kidTransform is likely required.');
  }

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

const kidTransformRegex = /(did:(.+)\.transmute\.(.+)):(.+\.)(.+)/;
const transformNestedDIDToDID = (did) => {
  const result = did.match(kidTransformRegex);
  if (result) {
    const maybeKIDInDID = result[5].split(`#${publicKeyKIDPrefix}`);
    const didSignatureMethod = result[3];
    const didSignatureID = maybeKIDInDID[0];
    const kid = maybeKIDInDID[1];
    const kidPart = kid ? `#${publicKeyKIDPrefix}${kid}` : '';
    return `did:transmute.${didSignatureMethod}:${didSignatureID}${kidPart}`;
  }
  return did;
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
  kidTransformRegex,
  transformNestedDIDToDID,
};

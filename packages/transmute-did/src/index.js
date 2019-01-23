const sodiumExtensions = require('./lib/cryptoSuites/sodiumExtensions');
const openpgpExtensions = require('./lib/cryptoSuites/openpgpExtensions');
const shamirExtensions = require('./lib/cryptoSuites/shamirExtensions');
const ellipticExtensions = require('./lib/cryptoSuites/ellipticExtensions');
const ethereumExtensions = require('./lib/cryptoSuites/ethereumExtensions');
const { TransmuteDIDWallet, createWallet, getPrimaryKidForDid } = require('./lib/wallet');
const misc = require('./lib/misc');

const SignatureStore = require('./lib/SignatureStore');

const schema = require('./json-schemas');

const {
  getPublicKeyFromDIDDocByKID,
  verifyDIDSignature,
  publicKeyKIDPrefix,
  constructDIDPublicKeyID,
  publicKeyToDID,
  verifySignedLinkedData,
  verifyDIDSignatureWithResolver,
  isLinkedDataSignedByDocument,
} = require('./lib/signatureMethods');

const DIDLinkedDataSignatureVerifier = require('./lib/DIDLinkedDataSignatureVerifier');

module.exports = {
  schema,
  ellipticExtensions,
  sodiumExtensions,
  openpgpExtensions,
  shamirExtensions,
  ethereumExtensions,
  TransmuteDIDWallet,
  createWallet,
  getPrimaryKidForDid,
  misc,
  SignatureStore,
  getPublicKeyFromDIDDocByKID,
  verifyDIDSignature,
  publicKeyKIDPrefix,
  constructDIDPublicKeyID,
  publicKeyToDID,
  verifySignedLinkedData,
  verifyDIDSignatureWithResolver,
  isLinkedDataSignedByDocument,
  DIDLinkedDataSignatureVerifier,
};

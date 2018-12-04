const sodiumExtensions = require('./lib/cryptoSuites/sodiumExtensions');
const openpgpExtensions = require('./lib/cryptoSuites/openpgpExtensions');
const shamirExtensions = require('./lib/cryptoSuites/shamirExtensions');
const ellipticExtensions = require('./lib/cryptoSuites/ellipticExtensions');
const ethereumExtensions = require('./lib/cryptoSuites/ethereumExtensions');
const wallet = require('./lib/wallet');
const misc = require('./lib/misc');
const {
  SignatureStore,
  getPublicKeyFromDIDDocByKID,
  verifyDIDSignature,
  publicKeyKIDPrefix,
  constructDIDPublicKeyID,
  transformNestedDIDToDID,
} = require('./lib/did');

module.exports = {
  ellipticExtensions,
  sodiumExtensions,
  openpgpExtensions,
  shamirExtensions,
  ethereumExtensions,
  wallet,
  misc,
  SignatureStore,
  getPublicKeyFromDIDDocByKID,
  verifyDIDSignature,
  publicKeyKIDPrefix,
  constructDIDPublicKeyID,
  transformNestedDIDToDID,
};

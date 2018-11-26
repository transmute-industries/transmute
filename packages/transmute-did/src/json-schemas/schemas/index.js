const didSchema = require('./did/did.json');
const didDocumentSchema = require('./did_document/did_document.json');
const didWalletCiphertextSchema = require('./did_wallet_ciphertext/did_wallet_ciphertext.json');
const didWalletPlaintextSchema = require('./did_wallet_plaintext/did_wallet_plaintext.json');
const didWalletSignatureSchema = require('./did_wallet_signature/did_wallet_signature.json');

module.exports = {
  didSchema,
  didDocumentSchema,
  didWalletCiphertextSchema,
  didWalletPlaintextSchema,
  didWalletSignatureSchema,
};

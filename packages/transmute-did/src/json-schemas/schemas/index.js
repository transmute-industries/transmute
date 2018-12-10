
const schema = require('./com/schema.json');

const selfDescSchema = require('./com/com.transmute.self-desc.json')

const did = require('./did/did.json');
const didDocument = require('./did_document/did_document.json');
const didRevocationCertSchema = require('./did_revocation_cert/did_revocation_cert.json');
const didWalletCiphertext = require('./did_wallet_ciphertext/did_wallet_ciphertext.json');
const didWalletPlaintext = require('./did_wallet_plaintext/did_wallet_plaintext.json');
const didSignature = require('./did_signature/did_signature.json');

const ldProof = require('./ld_proof/ld_proof.json');

module.exports = {
  schema,
  selfDescSchema,
  did,
  didDocument,
  didRevocationCertSchema,
  didWalletCiphertext,
  didWalletPlaintext,
  didSignature,
  ldProof,
};

const openpgp = require('openpgp');

const fs = require('fs');

const ocap = require('./ocap');

const didMethod = require('../../did/constants').didMethods.OPENPGP;

const { armoredKeytoFingerprintHex } = require('../cryptoHelpers');

const verifyDIDDocumentWasSignedByID = async (didDocumentPath, didDocumentSignaturePath) => {
  const didDocument = fs.readFileSync(didDocumentPath);

  const didDocumentJson = JSON.parse(didDocument);

  const didDocumentSignature = fs.readFileSync(didDocumentSignaturePath).toString();

  const signedArmor = didDocumentSignature;
  const pubkey = didDocumentJson.publicKey[0].publicKeyPem;

  const options = {
    message: openpgp.message.fromBinary(didDocument), // CleartextMessage or Message object
    signature: await openpgp.signature.readArmored(signedArmor), // parse detached signature
    publicKeys: (await openpgp.key.readArmored(pubkey)).keys, // for verification
  };

  const verified = await openpgp.verify(options);
  const validity = verified.signatures[0].valid; // true
  if (validity) {
    // console.log("signed by key id " + verified.signatures[0].keyid.toHex());
    const didParts = didDocumentJson.id.split(':');
    const fingerprint = didParts[didParts.length - 1];
    const kid = verified.signatures[0].keyid.toHex();
    const signatureMathesFingerprint = fingerprint.substring(24).toLowerCase() === kid;
    return signatureMathesFingerprint;
  }
  return false;
};

const armoredKeytoDID = async armoredKey => `did:${didMethod}:${await armoredKeytoFingerprintHex(armoredKey)}`;

const createDIDDocumentFromPublicKey = async (publicKey) => {
  const did = await armoredKeytoDID(publicKey);

  const didDocument = `
  {
      "@context": "https://w3id.org/did/v1",
      "id": "${did}",
      "publicKey": [
          {
              "id": "${did}#keys-1",
              "type": "RsaVerificationKey2018",
              "owner": "${did}",
              "publicKeyPem": ${JSON.stringify(publicKey)}
          }
      ],
      "authentication": [
          {
              "type": "RsaSignatureAuthentication2018",
              "publicKey": "${did}#keys-1"
          }
      ]
    }
  `;
  return didDocument;
};

module.exports = {
  didMethod,
  armoredKeytoDID,
  createDIDDocumentFromPublicKey,
  ocap,
  verifyDIDDocumentWasSignedByID,
};

const openpgp = require('openpgp');

const ocap = require('./ocap');

const didMethod = 'gpg:fingerprint';

const armoredKeytoDID = async (armoredKey) => {
  const { keys } = await openpgp.key.readArmored(armoredKey);
  const hex = Buffer.from(keys[0].keyPacket.fingerprint).toString('hex');
  return `did:${didMethod}:${hex}`;
};

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
};

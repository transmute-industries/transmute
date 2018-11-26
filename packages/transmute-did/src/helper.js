const { misc, sodiumExtensions, openpgpExtensions } = require('./index.js');

const generateDID = async () => {
  // Generate keys
  const pgpKeypair = await openpgpExtensions.cryptoHelpers.generateArmoredKeypair({
    name: 'bob',
    passphrase: 'yolo',
  });
  const libSodiumSigningKeypair = await sodiumExtensions.generateCryptoSignKeypair();
  const libSodiumEncryptionKeypair = await sodiumExtensions.generateCryptoBoxKeypair();
  const primaryPublicKey = libSodiumSigningKeypair.publicKey;
  // Generate DID
  const did = misc.publicKeyToTransmuteDID({ publicKey: primaryPublicKey });
  // Generate DID document
  const didDocumentArgs = {
    primaryPublicKey,
    pgpPublicKey: pgpKeypair.publicKey,
    libSodiumPublicSigningKey: libSodiumSigningKeypair.publicKey,
    libSodiumPublicEncryptionKey: libSodiumEncryptionKeypair.publicKey,
  };
  const didDocument = await misc.publicKeysToDIDDocument(didDocumentArgs);

  return { did, didDocument };
};

module.exports = {
  generateDID,
};

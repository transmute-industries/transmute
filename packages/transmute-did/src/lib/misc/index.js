const { keccak256 } = require('js-sha3');

const sodiumExtensions = require('../sodiumExtensions');

/**
 * converts a public key into a DID
 * @function
 * @name publicKeyToTransmuteDID
 * @param {String} publicKey a public key in hex
 * @returns {String} a DID
 */
const publicKeyToTransmuteDID = ({ publicKey }) => `did:tst:0x${keccak256(publicKey)}`;

/**
 * converts public keys into a DID Document
 * @function
 * @name publicKeysToDIDDocument
 * @param {String} primaryPublicKey a public key in hex
 * @param {String} pgpPublicKey armored locked public key
 * @param {String} libSodiumPublicSigningKey libsodium public key in hex
 * @param {String} libSodiumPublicEncryptionKey libsodium public key in hex
 * @returns {Object} a DID Document
 */
const publicKeysToDIDDocument = ({
  primaryPublicKey,
  pgpPublicKey,
  libSodiumPublicSigningKey,
  libSodiumPublicEncryptionKey,
}) => {
  const did = publicKeyToTransmuteDID({
    publicKey: primaryPublicKey,
  });

  return {
    '@context': 'https://w3id.org/did/v1',
    id: did,
    publicKey: [
      {
        id: `${did}#keys-0`,
        type: 'Ed25519VerificationKey2018',
        owner: did,
        publicKeyHex: libSodiumPublicEncryptionKey,
      },
      {
        id: `${did}#keys-1`,
        type: 'Ed25519VerificationKey2018',
        owner: did,
        publicKeyHex: libSodiumPublicSigningKey,
      },
      {
        id: `${did}#keys-2`,
        type: 'Secp256k1VerificationKey2018',
        owner: did,
        publicKeyPem: pgpPublicKey,
      },
      {
        id: `${did}#keys-3`,
        type: 'Ed25519VerificationKey2018',
        owner: did,
        publicKeyHex: primaryPublicKey,
      },
    ],
    authentication: [
      {
        type: 'Ed25519SignatureAuthentication2018',
        publicKey: `${did}#keys-1`,
      },
    ],
  };
};

/**
 * converts keypairs to a ciphertext wallet
 * @function
 * @name keypairsToTransmuteCiphertextDIDWallet
 * @param {Object} primaryKeypair a keypair in hex
 * @param {Object} pgpKeypair armored locked keypair
 * @param {Object} libSodiumSigningKeypair libsodium keypair in hex
 * @param {Object} libSodiumEncryptionKeypair libsodium keypair in hex
 * @returns {Object} a salt and wallet nonce and encrypted ciphertext in hex
 */
const keypairsToTransmuteCiphertextDIDWallet = async ({
  primaryKeypair,
  pgpKeypair,
  libSodiumSigningKeypair,
  libSodiumEncryptionKeypair,
  password,
}) => {
  const plainTextWallet = {
    primaryKeypair,
    pgpKeypair,
    libSodiumSigningKeypair,
    libSodiumEncryptionKeypair,
  };

  const salt = await sodiumExtensions.generateSalt();

  const key = await sodiumExtensions.generateSymmetricKeyFromPasswordAndSalt({
    password,
    salt,
  });

  const cipherTextWallet = {
    salt,
    wallet: await sodiumExtensions.encryptJson({
      data: plainTextWallet,
      key,
    }),
  };

  return cipherTextWallet;
};

module.exports = {
  publicKeyToTransmuteDID,
  publicKeysToDIDDocument,
  keypairsToTransmuteCiphertextDIDWallet,
};

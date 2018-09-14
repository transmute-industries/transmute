const secrets = require("secrets.js-grempe");

const msg = require("../msg");

const { keccak256 } = require("js-sha3");

/**
 * shatter a key with shamir secret sharing
 * @function
 * @name shatterKey
 * @param {String} key a hex encoded symmetric key to shatter
 * @param {String} shareNumber number of shares to create
 * @param {String} shareThreshold number of shares needed to recover key
 * @returns {Array} shamir secret shares of the key
 */
const shatterKey = async ({ key, shareNumber, shareThreshold }) => {
  return secrets.share(key, shareNumber, shareThreshold);
};

/**
 * recover a key with shamir secret sharing
 * @function
 * @name recoverKey
 * @param {Array} shares of a key
 * @returns {String} a key recoverd from shares
 */
const recoverKey = async ({ shares }) => {
  return secrets.combine(shares);
};

/**
 * converts a public key into a DID
 * @function
 * @name publicKeyToTransmuteDID
 * @param {String} publicKey a public key in hex
 * @returns {String} a DID
 */
const publicKeyToTransmuteDID = ({ publicKey }) =>
  `did:tst:0x${keccak256(publicKey)}`;

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
  libSodiumPublicEncryptionKey
}) => {
  const did = publicKeyToTransmuteDID({
    publicKey: primaryPublicKey
  });

  return {
    "@context": "https://w3id.org/did/v1",
    id: did,
    publicKey: [
      {
        id: `${did}#keys-0`,
        type: "x25519VerificationKey2018",
        owner: did,
        publicKey: libSodiumPublicEncryptionKey
      },
      {
        id: `${did}#keys-1`,
        type: "Ed25519VerificationKey2018",
        owner: did,
        publicKey: libSodiumPublicSigningKey
      },
      {
        id: `${did}#keys-2`,
        type: "Secp256k1VerificationKey2018",
        owner: did,
        publicKeyPem: pgpPublicKey
      },
      {
        id: `${did}#keys-3`,
        type: "Ed25519VerificationKey2018",
        owner: did,
        publicKey: primaryPublicKey
      }
    ],
    authentication: [
      {
        type: "Ed25519SignatureAuthentication2018",
        publicKey: `${did}#keys-1`
      }
    ]
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
  password
}) => {
  const plainTextWallet = {
    primaryKeypair,
    pgpKeypair,
    libSodiumSigningKeypair,
    libSodiumEncryptionKeypair
  };

  const salt = await msg.generateSalt();

  const key = await msg.generateSymmetricKeyFromPasswordAndSalt({
    password,
    salt
  });

  const cipherTextWallet = {
    salt,
    wallet: await msg.encryptJson({
      data: plainTextWallet,
      key
    })
  };

  return cipherTextWallet;
};

module.exports = {
  shatterKey,
  recoverKey,
  publicKeysToDIDDocument,
  keypairsToTransmuteCiphertextDIDWallet
};

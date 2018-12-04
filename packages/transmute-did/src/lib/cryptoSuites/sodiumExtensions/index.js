const sodiumWrappers = require('libsodium-wrappers');

/**
 * initializes the lib sodium library
 * @function
 * @name initSodium
 * @returns {Object} the initialized sodium library. Ready for use.
 */
const initSodium = async () => {
  await sodiumWrappers.ready;
  return sodiumWrappers;
};

/**
 * generates a sodium keypair for signing
 * @function
 * @name generateCryptoSignKeypair
 * @returns {Object} public and private keys in hex
 */
const generateCryptoSignKeypair = async () => {
  const sodium = await initSodium();
  const keypair = sodium.crypto_sign_keypair();
  return {
    publicKey: sodium.to_hex(keypair.publicKey),
    privateKey: sodium.to_hex(keypair.privateKey),
    keyType: keypair.keyType,
  };
};

/**
 * generates a sodium keypair for authenticated encryption
 * @function
 * @name generateCryptoBoxKeypair
 * @returns {Object} public and private keys in hex
 */
const generateCryptoBoxKeypair = async () => {
  const sodium = await initSodium();
  const keypair = sodium.crypto_box_keypair();
  return {
    publicKey: sodium.to_hex(keypair.publicKey),
    privateKey: sodium.to_hex(keypair.privateKey),
    keyType: keypair.keyType,
  };
};

/**
 * generates a random salt
 * @function
 * @name generateSalt
 * @returns {String} a random salt in hex
 */
const generateSalt = async () => {
  const sodium = await initSodium();
  return sodium.to_hex(sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES));
};

/**
 * generates a symmetric key from a password and a salt
 * @function
 * @name generateSymmetricKeyFromPasswordAndSalt
 * @param {String} password to be combined with salt to generate key
 * @param {String} salt to be combined with password to generate key
 * @returns {String} key libsodium symmetric key in hex
 */
const generateSymmetricKeyFromPasswordAndSalt = async ({ password, salt }) => {
  const sodium = await initSodium();
  return sodium.to_hex(
    sodium.crypto_pwhash(
      sodium.crypto_box_SEEDBYTES,
      password,
      sodium.from_hex(salt),
      sodium.crypto_pwhash_OPSLIMIT_MIN,
      sodium.crypto_pwhash_MEMLIMIT_MIN,
      sodium.crypto_pwhash_ALG_DEFAULT,
    ),
  );
};

/**
 * encrypts a string data with a libsodium symmetric key
 * @function
 * @name encryptWith
 * @param {String} data plaintext to be encrypted
 * @param {String} key libsodium symmetric key in hex
 * @returns {Object} encrypted ciphertext and nonce in hex
 */
const encryptWith = async ({ data, key }) => {
  const sodium = await initSodium();
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const encrypted = sodium.crypto_secretbox_easy(
    data,
    nonce,
    sodium.from_hex(key),
  );
  return {
    nonce: sodium.to_hex(nonce),
    encrypted: sodium.to_hex(encrypted),
  };
};

/**
 * decrypts a string data with a libsodium symmetric key
 * @function
 * @name decryptWith
 * @param {Object} data json object with cipher text with nonce in hex
 * @param {Object} key libsodium symmetric key in hex
 * @returns {String} plaintext decrypted
 */
const decryptWith = async ({ data, key }) => {
  const sodium = await initSodium();
  const decrypted = sodium.crypto_secretbox_open_easy(
    sodium.from_hex(data.encrypted),
    sodium.from_hex(data.nonce),
    sodium.from_hex(key),
  );
  return Buffer.from(decrypted).toString();
};

/**
 * encrypts a json object data with a libsodium symmetric key
 * @function
 * @name encryptJson
 * @param {Object} data json object to be encrypted
 * @param {String} key libsodium symmetric key in hex
 * @returns {Object} encrypted ciphertext and nonce in hex
 */
const encryptJson = async ({ data, key }) => encryptWith({
  data: JSON.stringify(data),
  key,
});

/**
 * decrypts a json object data with a libsodium symmetric key
 * @function
 * @name decryptJson
 * @param {Object} data json object with cipher text with nonce in hex
 * @param {Object} key libsodium symmetric key in hex form
 * @returns {Object} plaintext json
 */
const decryptJson = async ({ data, key }) => JSON.parse(
  await decryptWith({
    data,
    key,
  }),
);

/**
 * generate detached signature from message and private key
 * @function
 * @name signDetached
 * @param {String} message plaintext string to be signed
 * @param {String} privateKey libsodium private key in hex form
 * @returns {String} detached signature in hex
 */
const signDetached = async ({ message, privateKey }) => {
  const sodium = await initSodium();
  return sodium.to_hex(
    sodium.crypto_sign_detached(message, sodium.from_hex(privateKey)),
  );
};

/**
 * verify a detached signature from signature and public key
 * @function
 * @name verifyDetached
 * @param {String} message plaintext string to be signed
 * @param {String} signature detached signature in hex
 * @param {String} publicKey libsodium public key
 * @returns {Boolean} true if signature was generated with the correct private key
 */
const verifyDetached = async ({ message, signature, publicKey }) => {
  const sodium = await initSodium();
  return sodium.crypto_sign_verify_detached(
    sodium.from_hex(signature),
    message,
    sodium.from_hex(publicKey),
  );
};

/**
 * encrypt a message for a public key from a private key
 * @function
 * @name encryptFor
 * @param {String} message plaintext string to be signed
 * @param {String} publicKey libsodium public key
 * @param {String} privateKey libsodium private key
 * @returns {Object} a nonce and encrypted ciphertext in hex
 */
const encryptFor = async ({ message, publicKey, privateKey }) => {
  const sodium = await initSodium();
  const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);

  const encrypted = sodium.crypto_box_easy(
    message,
    nonce,
    sodium.from_hex(publicKey),
    sodium.from_hex(privateKey),
  );

  return {
    nonce: sodium.to_hex(nonce),
    encrypted: sodium.to_hex(encrypted),
  };
};

/**
 * decrypt a message from a public key for a private key
 * @function
 * @name decryptFor
 * @param {String} message plaintext string to be signed
 * @param {String} publicKey libsodium public key
 * @param {String} privateKey libsodium private key
 * @returns {Object} a nonce and encrypted ciphertext in hex
 */
const decryptFor = async ({ message, publicKey, privateKey }) => {
  const sodium = await initSodium();
  const plainText = sodium.crypto_box_open_easy(
    sodium.from_hex(message.encrypted),
    sodium.from_hex(message.nonce),
    sodium.from_hex(publicKey),
    sodium.from_hex(privateKey),
  );
  return Buffer.from(plainText).toString('utf8');
};

module.exports = {
  generateSalt,
  generateCryptoSignKeypair,
  generateCryptoBoxKeypair,
  generateSymmetricKeyFromPasswordAndSalt,
  encryptWith,
  decryptWith,
  encryptJson,
  decryptJson,
  signDetached,
  verifyDetached,
  encryptFor,
  decryptFor,
};

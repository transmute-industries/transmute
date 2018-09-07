const sodiumWrappers = require("libsodium-wrappers");

const initSodium = async () => {
  await sodiumWrappers.ready;
  return sodiumWrappers;
};

const generateCryptoSignKeypair = async () => {
  const sodium = await initSodium();
  const keypair = sodium.crypto_sign_keypair();
  return {
    publicKey: sodium.to_hex(keypair.publicKey),
    privateKey: sodium.to_hex(keypair.privateKey),
    keyType: keypair.keyType
  };
};

const generateCryptoBoxKeypair = async () => {
  const sodium = await initSodium();
  const keypair = sodium.crypto_box_keypair();
  return {
    publicKey: sodium.to_hex(keypair.publicKey),
    privateKey: sodium.to_hex(keypair.privateKey),
    keyType: keypair.keyType
  };
};

const generateSalt = async () => {
  const sodium = await initSodium();
  return sodium.to_hex(sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES));
};

const generateSymmetricKeyFromPasswordAndSalt = async ({ password, salt }) => {
  const sodium = await initSodium();
  return sodium.to_hex(
    sodium.crypto_pwhash(
      sodium.crypto_box_SEEDBYTES,
      password,
      sodium.from_hex(salt),
      sodium.crypto_pwhash_OPSLIMIT_MIN,
      sodium.crypto_pwhash_MEMLIMIT_MIN,
      sodium.crypto_pwhash_ALG_DEFAULT
    )
  );
};

const encryptWith = async ({ data, key }) => {
  const sodium = await initSodium();
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const encrypted = sodium.crypto_secretbox_easy(
    data,
    nonce,
    sodium.from_hex(key)
  );
  return {
    nonce: sodium.to_hex(nonce),
    encrypted: sodium.to_hex(encrypted)
  };
};

const decryptWith = async ({ data, key }) => {
  const sodium = await initSodium();
  const decrypted = sodium.crypto_secretbox_open_easy(
    sodium.from_hex(data.encrypted),
    sodium.from_hex(data.nonce),
    sodium.from_hex(key)
  );
  return Buffer.from(decrypted).toString();
};

const encryptJson = async ({ data, key }) => {
  return encryptWith({
    data: JSON.stringify(data),
    key
  });
};

const decryptJson = async ({ data, key }) => {
  return JSON.parse(
    await decryptWith({
      data,
      key
    })
  );
};

const signDetached = async ({ message, privateKey }) => {
  const sodium = await initSodium();
  return sodium.to_hex(
    sodium.crypto_sign_detached(message, sodium.from_hex(privateKey))
  );
};

const verifyDetached = async ({ message, signature, publicKey }) => {
  const sodium = await initSodium();
  return sodium.crypto_sign_verify_detached(
    sodium.from_hex(signature),
    message,
    sodium.from_hex(publicKey)
  );
};

const encryptFor = async ({ message, publicKey, privateKey }) => {
  const sodium = await initSodium();
  const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);

  const encrypted = sodium.crypto_box_easy(
    message,
    nonce,
    sodium.from_hex(publicKey),
    sodium.from_hex(privateKey)
  );

  return {
    nonce: sodium.to_hex(nonce),
    encrypted: sodium.to_hex(encrypted)
  };
};

const decryptFor = async ({ message, publicKey, privateKey }) => {
  const sodium = await initSodium();
  const plainText = sodium.crypto_box_open_easy(
    sodium.from_hex(message.encrypted),
    sodium.from_hex(message.nonce),
    sodium.from_hex(publicKey),
    sodium.from_hex(privateKey)
  );
  return Buffer.from(plainText).toString("utf8");
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
  decryptFor
};

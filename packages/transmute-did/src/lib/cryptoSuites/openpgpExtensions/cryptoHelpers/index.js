const openpgp = require('openpgp');

/**
 * generate a hex fingerprint from an armored public key
 * @function
 * @name armoredKeytoFingerprintHex
 * @param {String} armoredKey public key
 * @returns {String} hex encoded pgp fingerprint
 */
const armoredKeytoFingerprintHex = async (armoredKey) => {
  const { keys } = await openpgp.key.readArmored(armoredKey);
  const hex = Buffer.from(keys[0].keyPacket.fingerprint).toString('hex');
  return hex;
};

/**
 * generate an armored pgp keypair
 * @function
 * @name generateArmoredKeypair
 * @param {String} name to be encoded in key (careful with PII!)
 * @param {String} passphrase to protect the private key
 * @returns {Object} public and private keys in armored format
 */
const generateArmoredKeypair = async ({ name, passphrase }) => {
  const secOptions = {
    userIds: [
      {
        name,
      },
    ],
    curve: 'secp256k1',
    passphrase,
  };

  const keypair = await openpgp.generateKey(secOptions);
  return {
    publicKey: keypair.publicKeyArmored,
    privateKey: keypair.privateKeyArmored,
  };
};

/**
 * encrypt a message for a public key from a private key
 * @function
 * @name encryptMessage
 * @param {String} message to be encrypted
 * @param {String} privateKey to send from
 * @param {String} publicKey to send to
 * @param {String} passphrase for private key
 * @returns {String} armored pgp message
 */
const encryptMessage = async ({
  message, privateKey, publicKey, passphrase,
}) => {
  const privKeyObj = (await openpgp.key.readArmored(privateKey)).keys[0];
  await privKeyObj.decrypt(passphrase);

  const options = {
    message: openpgp.message.fromText(message), // input as String (or Uint8Array)
    publicKeys: (await openpgp.key.readArmored(publicKey)).keys, // for encryption
    privateKeys: [privKeyObj], // for signing (optional)
  };

  return openpgp.encrypt(options).then((ciphertext) => {
    const encrypted = ciphertext.data; // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'
    return encrypted;
  });
};

/**
 * decrypt a message for a private key from a public key
 * @function
 * @name decryptMessage
 * @param {String} message to be decrypted
 * @param {String} privateKey used to receive message
 * @param {String} publicKey used to send message
 * @param {String} passphrase for private key
 * @returns {String} plaintext message
 */
const decryptMessage = async ({
  message, privateKey, publicKey, passphrase,
}) => {
  const privKeyObj = (await openpgp.key.readArmored(privateKey)).keys[0];
  await privKeyObj.decrypt(passphrase);

  const options = {
    message: await openpgp.message.readArmored(message), // parse armored message
    publicKeys: (await openpgp.key.readArmored(publicKey)).keys, // for verification (optional)
    privateKeys: [privKeyObj], // for decryption
  };

  return openpgp.decrypt(options).then(plaintext => plaintext.data);
};

/**
 * sign a message with pgp
 * @function
 * @name sign
 * @param {String} message to be signed
 * @param {String} privateKey used to receive message
 * @param {String} passphrase for private key
 * @returns {String} an armored signed message
 */
const sign = async ({ message, privateKey, passphrase }) => {
  const privKeyObj = (await openpgp.key.readArmored(privateKey)).keys[0];
  await privKeyObj.decrypt(passphrase);

  const options = {
    message: openpgp.cleartext.fromText(message), // CleartextMessage or Message object
    privateKeys: [privKeyObj], // for signing
  };

  return new Promise((resolve, reject) => {
    openpgp.sign(options).then((signed) => {
      const cleartext = signed.data; // '-----BEGIN PGP SIGNED MESSAGE ... END PGP SIGNATURE-----'
      resolve(cleartext);
    });
  });
};

/**
 * verify a message was signed with a pgp public key
 * @function
 * @name verify
 * @param {String} message signed by public key
 * @param {String} publicKey used to sign message
 * @returns {Boolean} true is message was signed with public key
 */
const verify = async ({ message, publicKey }) => {
  const options = {
    message: await openpgp.cleartext.readArmored(message), // parse armored message
    publicKeys: (await openpgp.key.readArmored(publicKey)).keys, // for verification
  };

  return new Promise((resolve, reject) => {
    openpgp.verify(options).then((verified) => {
      const validity = verified.signatures[0].valid; // true
      // if (validity) {
      //   console.log("signed by key id " + verified.signatures[0].keyid.toHex());
      // }
      resolve(validity);
    });
  });
};

/**
 * get message plaintext from armored signed pgp message
 * @function
 * @name getMessagePayload
 * @param {String} cleartext signed pgp message
 * @returns {String} plaintext message
 */
const getMessagePayload = async cleartext => (await openpgp.cleartext.readArmored(cleartext)).text;

const signDetached = async (data, privateKey, passphrase) => {
  const privKeyObj = (await openpgp.key.readArmored(privateKey)).keys[0];
  await privKeyObj.decrypt(passphrase);
  const options = {
    message: openpgp.cleartext.fromText(data), // CleartextMessage or Message object
    privateKeys: [privKeyObj], // for signing
    detached: true,
  };
  const signed = await openpgp.sign(options);
  return signed.signature;
};

const verifyDetached = async (message, detachedSig, publicKey) => {
  const options = {
    message: openpgp.cleartext.fromText(message), // CleartextMessage or Message object
    signature: await openpgp.signature.readArmored(detachedSig), // parse detached signature
    publicKeys: (await openpgp.key.readArmored(publicKey)).keys, // for verification
  };

  const verified = await openpgp.verify(options);
  const validity = verified.signatures[0].valid; // true
  // if (validity) {
  //   console.log(`signed by key id ${verified.signatures[0].keyid.toHex()}`);
  // }
  return validity;
};

module.exports = {
  armoredKeytoFingerprintHex,
  generateArmoredKeypair,
  encryptMessage,
  decryptMessage,
  sign,
  verify,
  getMessagePayload,
  signDetached,
  verifyDetached,
};

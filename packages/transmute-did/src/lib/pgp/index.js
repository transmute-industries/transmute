const openpgp = require("openpgp");

const generateOpenPGPArmoredKeypair = async ({ name, passphrase }) => {
  const secOptions = {
    userIds: [
      {
        name
      }
    ],
    curve: "secp256k1",
    passphrase
  };

  const keypair = await openpgp.generateKey(secOptions);
  return {
    publicKey: keypair.publicKeyArmored,
    privateKey: keypair.privateKeyArmored
  };
};

const encryptMessage = async ({
  message,
  privateKey,
  publicKey,
  passphrase
}) => {
  const privKeyObj = (await openpgp.key.readArmored(privateKey)).keys[0];
  await privKeyObj.decrypt(passphrase);

  const options = {
    message: openpgp.message.fromText(message) , // input as String (or Uint8Array)
    publicKeys: (await openpgp.key.readArmored(publicKey)).keys, // for encryption
    privateKeys: [privKeyObj] // for signing (optional)
  };

  return openpgp.encrypt(options).then(ciphertext => {
    let encrypted = ciphertext.data; // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'
    return encrypted;
  });
};

const decryptMessage = async ({
  message,
  privateKey,
  publicKey,
  passphrase
}) => {
  const privKeyObj = (await openpgp.key.readArmored(privateKey)).keys[0];
  await privKeyObj.decrypt(passphrase);

  const options = {
    message: await openpgp.message.readArmored(message), // parse armored message
    publicKeys: (await openpgp.key.readArmored(publicKey)).keys, // for verification (optional)
    privateKeys: [privKeyObj] // for decryption
  };

  return openpgp.decrypt(options).then(plaintext => {
    return plaintext.data;
  });
};

const sign = async ({ message, privateKey, passphrase }) => {
  const privKeyObj = (await openpgp.key.readArmored(privateKey)).keys[0];
  await privKeyObj.decrypt(passphrase);

  let options = {
    message: openpgp.cleartext.fromText(message), // CleartextMessage or Message object
    privateKeys: [privKeyObj] // for signing
  };

  return new Promise((resolve, reject) => {
    openpgp.sign(options).then(function(signed) {
      let cleartext = signed.data; // '-----BEGIN PGP SIGNED MESSAGE ... END PGP SIGNATURE-----'
      resolve(cleartext);
    });
  });
};

const verify = async ({ message, publicKey }) => {
  let options = {
    message: await openpgp.cleartext.readArmored(message), // parse armored message
    publicKeys: (await openpgp.key.readArmored(publicKey)).keys // for verification
  };

  return new Promise((resolve, reject) => {
    openpgp.verify(options).then(function(verified) {
      let validity = verified.signatures[0].valid; // true
      // if (validity) {
      //   console.log("signed by key id " + verified.signatures[0].keyid.toHex());
      // }
      resolve(validity);
    });
  });
};

const getMessagePayload = async cleartext => {
  return (await openpgp.cleartext.readArmored(cleartext)).text;
};

module.exports = {
  generateOpenPGPArmoredKeypair,
  encryptMessage,
  decryptMessage,
  sign,
  verify,
  getMessagePayload
};

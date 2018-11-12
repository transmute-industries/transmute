const pack = require('../../../package.json');

const msg = require('../msg');

//   eslint-disable-next-line
const { sha3_256 } = require('js-sha3');

const createWallet = async () => ({
  version: pack.version,
  salt: await msg.generateSalt(),
  keystore: {
    assymetric: {},
    symmetric: {},
  },
});

const addKeypairToWallet = (wallet, keypair) => {
  //   eslint-disable-next-line
  wallet.keystore.assymetric[keypair.publicKey] = keypair;
};

const addKeyToWallet = (wallet, key) => {
  //   eslint-disable-next-line
  const sha3_256_of_key = sha3_256(key);
  //   eslint-disable-next-line
  wallet.keystore.symmetric[sha3_256_of_key] = key;
};

const encryptWallet = async (wallet, passphrase) => ({
  ...wallet,
  keystore: await msg.encryptJson({
    data: wallet.keystore,
    key: await msg.generateSymmetricKeyFromPasswordAndSalt({
      password: passphrase,
      salt: wallet.salt,
    }),
  }),
});

const decryptWallet = async (wallet, passphrase) => ({
  ...wallet,
  keystore: await msg.decryptJson({
    data: wallet.keystore,
    key: await msg.generateSymmetricKeyFromPasswordAndSalt({
      password: passphrase,
      salt: wallet.salt,
    }),
  }),
});

module.exports = {
  createWallet,
  addKeypairToWallet,
  encryptWallet,
  decryptWallet,
  addKeyToWallet,
};

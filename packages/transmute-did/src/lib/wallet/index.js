const pack = require('../../../package.json');

const sodiumExtensions = require('../sodiumExtensions');

//   eslint-disable-next-line
const { sha3_256 } = require('js-sha3');

class TransmuteDIDWallet {
  constructor(walletData) {
    this.data = walletData;
  }

  async addKey(data, type, meta) {
    let kid;
    const { keystore } = this.data;
    switch (type) {
      case 'symmetric':
        kid = sha3_256(data);
        break;
      case 'assymetric':
        kid = sha3_256(data.publicKey);
        break;
      default:
        throw new Error('Unknown key type.');
    }
    keystore[kid] = {
      data,
      type,
      meta,
    };
  }

  async encrypt(passphrase) {
    this.data = {
      ...this.data,
      keystore: await sodiumExtensions.encryptJson({
        data: this.data.keystore,
        key: await sodiumExtensions.generateSymmetricKeyFromPasswordAndSalt({
          password: passphrase,
          salt: this.data.salt,
        }),
      }),
    };
  }

  async decrypt(passphrase) {
    this.data = {
      ...this.data,
      keystore: await sodiumExtensions.decryptJson({
        data: this.data.keystore,
        key: await sodiumExtensions.generateSymmetricKeyFromPasswordAndSalt({
          password: passphrase,
          salt: this.data.salt,
        }),
      }),
    };
  }
}

const createWallet = async () => new TransmuteDIDWallet({
  version: pack.version,
  salt: await sodiumExtensions.generateSalt(),
  keystore: {
    assymetric: {},
    symmetric: {},
  },
});

module.exports = {
  TransmuteDIDWallet,
  createWallet,
};

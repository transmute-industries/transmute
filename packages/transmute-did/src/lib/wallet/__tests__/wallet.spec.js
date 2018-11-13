const fs = require('fs');
const path = require('path');
//   eslint-disable-next-line
const { sha3_256 } = require('js-sha3');

const didWallet = require('../index');

const pack = require('../../../../package.json');

const sodiumExtensions = require('../../sodiumExtensions');

const passphrase = 'yolo';

const emptyWalletPath = path.resolve(__dirname, '__fixtures__/wallet.plaintext.empty.json');

const fullWalletPath = path.resolve(__dirname, '__fixtures__/wallet.plaintext.full.json');

const cipherTextWalletPath = path.resolve(__dirname, '__fixtures__/wallet.ciphertext.full.json');

const recoveredPlaintextWalletPath = path.resolve(
  __dirname,
  '__fixtures__/wallet.plaintext.recovered.json',
);

describe('did-wallet', () => {
  describe('createWallet', () => {
    it('has a version', async () => {
      const wallet = await didWallet.createWallet();
      expect(wallet.data.version).toBe(pack.version);
      fs.writeFileSync(emptyWalletPath, JSON.stringify(wallet.data, null, 2));
    });
  });

  describe('addKey', () => {
    it('supports adding a libsodium signing key', async () => {
      const wallet = new didWallet.TransmuteDIDWallet(
        JSON.parse(fs.readFileSync(emptyWalletPath).toString()),
      );
      const keypair = await sodiumExtensions.generateCryptoSignKeypair();
      await wallet.addKey(keypair, 'assymetric', {
        version: `libsodium-wrappers@${pack.dependencies['libsodium-wrappers']}`,
        tags: ['signing key', 'macbook pro'],
        notes: 'created for testing purposes',
      });
      const kid = sha3_256(keypair.publicKey);
      expect(wallet.data.keystore[kid].data).toEqual(keypair);
      fs.writeFileSync(fullWalletPath, JSON.stringify(wallet.data, null, 2));
    });

    it('supports adding a libsodium symmetric key', async () => {
      const wallet = new didWallet.TransmuteDIDWallet(
        JSON.parse(fs.readFileSync(fullWalletPath).toString()),
      );
      const key = await sodiumExtensions.generateSymmetricKeyFromPasswordAndSalt({
        password: 'haha',
        salt: wallet.data.salt,
      });
      await wallet.addKey(key, 'symmetric', {
        version: `libsodium-wrappers@${pack.dependencies['libsodium-wrappers']}`,
        tags: ['symmetric key', 'macbook pro'],
        notes: 'created for testing purposes',
      });

      //   eslint-disable-next-line
      const kid = sha3_256(key);
      expect(wallet.data.keystore[kid].data).toEqual(key);
      fs.writeFileSync(fullWalletPath, JSON.stringify(wallet.data, null, 2));
    });
  });

  describe('encrypt', () => {
    it('supports encryption with a passphrase', async () => {
      const wallet = new didWallet.TransmuteDIDWallet(
        JSON.parse(fs.readFileSync(fullWalletPath).toString()),
      );
      await wallet.encrypt(passphrase);
      expect(wallet.data.keystore.nonce).toBeDefined();
      fs.writeFileSync(cipherTextWalletPath, JSON.stringify(wallet.data, null, 2));
    });
  });

  describe('decrypt', () => {
    it('supports decryption with a passphrase', async () => {
      const wallet = new didWallet.TransmuteDIDWallet(
        JSON.parse(fs.readFileSync(cipherTextWalletPath).toString()),
      );
      await wallet.decrypt(passphrase);
      expect(wallet.data.keystore.nonce).toBeUndefined();
      fs.writeFileSync(recoveredPlaintextWalletPath, JSON.stringify(wallet.data, null, 2));
    });
  });
});

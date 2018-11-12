const fs = require('fs');
const path = require('path');
//   eslint-disable-next-line
const { sha3_256 } = require('js-sha3');

const didWallet = require('../index');

const pack = require('../../../../package.json');

const msg = require('../../msg');

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
      expect(wallet.version).toBe(pack.version);
      fs.writeFileSync(emptyWalletPath, JSON.stringify(wallet, null, 2));
    });
  });

  describe('addKeypairToWallet', () => {
    it('supports adding a libsodium signing key', async () => {
      const wallet = JSON.parse(fs.readFileSync(emptyWalletPath).toString());
      const keypair = await msg.generateCryptoSignKeypair();
      didWallet.addKeypairToWallet(wallet, keypair);
      expect(wallet.keystore.assymetric[keypair.publicKey]).toEqual(keypair);
      fs.writeFileSync(fullWalletPath, JSON.stringify(wallet, null, 2));
    });
  });

  describe('addKeyToWallet', () => {
    it('supports adding a libsodium symmetric key', async () => {
      const wallet = JSON.parse(fs.readFileSync(fullWalletPath).toString());
      const key = await msg.generateSymmetricKeyFromPasswordAndSalt({
        password: 'haha',
        salt: wallet.salt,
      });
      didWallet.addKeyToWallet(wallet, key);
      //   eslint-disable-next-line
      const sha3_256_of_key = sha3_256(key);
      expect(wallet.keystore.symmetric[sha3_256_of_key]).toEqual(key);
      fs.writeFileSync(fullWalletPath, JSON.stringify(wallet, null, 2));
    });
  });

  describe('encryptWallet', () => {
    it('supports encryption with a passphrase', async () => {
      const wallet = JSON.parse(fs.readFileSync(fullWalletPath).toString());
      const cipherTextWallet = await didWallet.encryptWallet(wallet, passphrase);
      expect(cipherTextWallet.keystore.nonce).toBeDefined();
      fs.writeFileSync(cipherTextWalletPath, JSON.stringify(cipherTextWallet, null, 2));
    });
  });

  describe('decryptWallet', () => {
    it('supports decryption with a passphrase', async () => {
      const wallet = JSON.parse(fs.readFileSync(cipherTextWalletPath).toString());
      const plainTextWallet = await didWallet.decryptWallet(wallet, passphrase);
      expect(plainTextWallet.version).toBeDefined();
      fs.writeFileSync(recoveredPlaintextWalletPath, JSON.stringify(plainTextWallet, null, 2));
    });
  });
});

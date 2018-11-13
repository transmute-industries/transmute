const fs = require('fs');
const path = require('path');
//   eslint-disable-next-line
const { sha3_256 } = require('js-sha3');

const didWallet = require('../index');

const pack = require('../../../../package.json');

const sodiumExtensions = require('../../sodiumExtensions');
// const openpgpExtensions = require('../../openpgpExtensions');
const ethereumExtensions = require('../../ethereumExtensions');

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
    it('supports adding an openpgp keypair', async () => {
      const wallet = new didWallet.TransmuteDIDWallet(
        JSON.parse(fs.readFileSync(emptyWalletPath).toString()),
      );
      // const keypair = await openpgpExtensions.cryptoHelpers.generateArmoredKeypair({
      //   name: 'test-key',
      //   passphrase: 'yolo',
      // });
      const keypair = {
        publicKey:
          '-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.0.1\r\nComment: https://openpgpjs.org\r\n\r\nxk8EW+sYmRMFK4EEAAoCAwQgn6FzXRZot68Pudbhd1zXxc8loBPpqFmuli9f\nsa6xeTNFjY9IhOAGr0HQNEKh4DhyuIoHf0CTtkzKBEHECK4mzQh0ZXN0LWtl\necJ3BBATCAApBQJb6xiZBgsJBwgDAgkQcC0BOMNJygQEFQgKAgMWAgECGQEC\nGwMCHgEAAFAyAP9gy5LEX/24+YA1o7Hc5mLfWvsx/fpU48xCKd8JD22TPwEA\n3Fgf3c0NvoF0UxfR5ldDSvTvp+jrw5gvueZTzHlmNOPOUwRb6xiZEgUrgQQA\nCgIDBDtD+1QEekxkg8yU83fN+nMFAOgLOm2KKxhGxypyPZJgubSEk5J1kFrG\nQtu11L9Afo3QIezx0/iKKnv8sMDupkUDAQgHwmEEGBMIABMFAlvrGJkJEHAt\nATjDScoEAhsMAABFvwEA3Xr3daeZThSbNEklVtrOvC3Um9gXZsqHDEELF2rF\nzCUA/RkscQMeVcd6AH8f3Vl6SneXiY9qTgJfD6NAP0qMYsEo\r\n=8g9/\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n\r\n',
        privateKey:
          '-----BEGIN PGP PRIVATE KEY BLOCK-----\r\nVersion: OpenPGP.js v4.0.1\r\nComment: https://openpgpjs.org\r\n\r\nxaIEW+sYmRMFK4EEAAoCAwQgn6FzXRZot68Pudbhd1zXxc8loBPpqFmuli9f\nsa6xeTNFjY9IhOAGr0HQNEKh4DhyuIoHf0CTtkzKBEHECK4m/gkDCElM2RIS\n5A8UYEMzrt+QUoinLYClsFXn2adofnxcgHvIEJco49cSfBRxHBz/wfvrYJqY\ndsXBe34oVVYHzlD/m5PPu/w8GOeofQhtP5Ym+ZvNCHRlc3Qta2V5wncEEBMI\nACkFAlvrGJkGCwkHCAMCCRBwLQE4w0nKBAQVCAoCAxYCAQIZAQIbAwIeAQAA\nUDIA/2DLksRf/bj5gDWjsdzmYt9a+zH9+lTjzEIp3wkPbZM/AQDcWB/dzQ2+\ngXRTF9HmV0NK9O+n6OvDmC+55lPMeWY048emBFvrGJkSBSuBBAAKAgMEO0P7\nVAR6TGSDzJTzd836cwUA6As6bYorGEbHKnI9kmC5tISTknWQWsZC27XUv0B+\njdAh7PHT+Ioqe/ywwO6mRQMBCAf+CQMIx+d7MSnsDUhgstAN9lH4zG10f8Mu\n+NuvqEOeAdMF1t87ebInjDqKIPyNp0a4HkNXwOxvTeeLWiuh8AsZmWmr/aAH\nEmUUkDSXpbnwTD9aWMJhBBgTCAATBQJb6xiZCRBwLQE4w0nKBAIbDAAARb8B\nAN1693WnmU4UmzRJJVbazrwt1JvYF2bKhwxBCxdqxcwlAP0ZLHEDHlXHegB/\nH91Zekp3l4mPak4CXw+jQD9KjGLBKA==\r\n=hfYr\r\n-----END PGP PRIVATE KEY BLOCK-----\r\n',
      };
      await wallet.addKey(keypair, 'assymetric', {
        version: `openpgp@${pack.dependencies.openpgp}`,
        tags: ['OpenPGP.js', 'macbook pro'],
        notes: 'created for testing purposes',
        did: {
          publicKey: true,
          authentication: true,
          publicKeyType: 'publicKeyPem',
          signatureType: 'Secp256k1VerificationKey2018',
        },
      });
      const kid = sha3_256(keypair.publicKey);
      expect(wallet.data.keystore[kid].data).toEqual(keypair);
      fs.writeFileSync(fullWalletPath, JSON.stringify(wallet.data, null, 2));
    });

    it('supports adding an ethereum keypair', async () => {
      // const mneumonic = await ethereumExtensions.generateBIP39Mnemonic();
      const mneumonic = 'pear outside bone car depend dentist evil arrive rhythm price stand off';
      const hdPath = "m/44'/60'/0'/0/0";
      const keypair = await ethereumExtensions.mnemonicToKeypair(mneumonic, hdPath);

      const wallet = new didWallet.TransmuteDIDWallet(
        JSON.parse(fs.readFileSync(fullWalletPath).toString()),
      );

      await wallet.addKey(keypair, 'assymetric', {
        version: `hdkey@${pack.dependencies.hdkey}`,
        tags: ['Ethereum', 'macbook pro'],
        notes: 'created for testing purposes',
        did: {
          publicKey: true,
          authentication: true,
          publicKeyType: 'publicKeyHex',
          signatureType: 'Secp256k1VerificationKey2018',
        },
      });
      const kid = sha3_256(keypair.publicKey);
      expect(wallet.data.keystore[kid].data).toEqual(keypair);
      fs.writeFileSync(fullWalletPath, JSON.stringify(wallet.data, null, 2));
    });

    it('supports adding an orbitdb keypair', async () => {
      const keypair = {
        publicKey:
          '04c44cb158a11cd03f30b713276faf8cf8869fccb2a48662dc43fcde61af5008040270257a3734f47acbb1bf2def85b7a4c0d213ab634bc2e79dbc4c1916d45a4f',
        privateKey: 'ef3ff305e9492fa7904eb3c671df5f683c68548153bc8d6cf2dc663f06e13dfe',
      };

      const wallet = new didWallet.TransmuteDIDWallet(
        JSON.parse(fs.readFileSync(fullWalletPath).toString()),
      );

      await wallet.addKey(keypair, 'assymetric', {
        version: 'orbit-db',
        tags: ['OrbitDB', 'macbook pro'],
        notes: 'created for testing purposes',
        did: {
          publicKey: true,
          authentication: true,
          publicKeyType: 'publicKeyHex',
          signatureType: 'Secp256k1VerificationKey2018',
        },
      });
      const kid = sha3_256(keypair.publicKey);
      expect(wallet.data.keystore[kid].data).toEqual(keypair);
      fs.writeFileSync(fullWalletPath, JSON.stringify(wallet.data, null, 2));
    });

    it('supports adding a libsodium signing key', async () => {
      const wallet = new didWallet.TransmuteDIDWallet(
        JSON.parse(fs.readFileSync(fullWalletPath).toString()),
      );
      // const keypair = await sodiumExtensions.generateCryptoSignKeypair();
      const keypair = {
        publicKey: '0dd352b917fe90926c3ac045d91c37bdcc22e2ca90e0cc3b3409be8ceda936a6',
        privateKey:
          '2d0437158ac5b13a1b6978057be38a8fdc85c4021f33b946d368e12efe81a8b30dd352b917fe90926c3ac045d91c37bdcc22e2ca90e0cc3b3409be8ceda936a6',
        keyType: 'ed25519',
      };
      await wallet.addKey(keypair, 'assymetric', {
        version: `libsodium-wrappers@${pack.dependencies['libsodium-wrappers']}`,
        tags: ['signing key', 'macbook pro'],
        notes: 'created for testing purposes',
        did: {
          publicKey: true,
          authentication: true,
          publicKeyType: 'publicKeyHex',
          signatureType: 'Ed25519VerificationKey2018',
        },
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

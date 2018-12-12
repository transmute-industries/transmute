const tmp = require('tmp');
const fs = require('fs');
const stringify = require('json-stringify-deterministic');
//   eslint-disable-next-line
const { sha3_256 } = require('js-sha3');

const {
  createWallet,
  TransmuteDIDWallet,
  schema,
  sodiumExtensions,
  ethereumExtensions,
} = require('../../../index');

const pack = require('../../../../package.json');

const emptyWalletPath = tmp.fileSync().name;
const fullWalletPath = tmp.fileSync().name;
const cipherTextWalletPath = tmp.fileSync().name;
const recoveredPlaintextWalletPath = tmp.fileSync().name;

const passphrase = 'yolo';

describe('did-wallet', () => {
  describe('createWallet', () => {
    it('has a version', async () => {
      const wallet = await createWallet();
      expect(wallet.data.version).toBe(pack.version);
      expect(schema.validator.isValid(wallet.data, schema.schemas.didWalletPlaintext)).toBe(
        true,
      );
      fs.writeFileSync(emptyWalletPath, stringify(wallet.data, null, 2));
    });
  });

  describe('addKey', () => {
    it('supports adding an openpgp keypair', async () => {
      const wallet = new TransmuteDIDWallet(
        JSON.parse(fs.readFileSync(emptyWalletPath).toString()),
      );
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
      expect(schema.validator.isValid(wallet.data, schema.schemas.didWalletPlaintext)).toBe(
        true,
      );
      fs.writeFileSync(fullWalletPath, stringify(wallet.data, null, 2));
    });

    it('supports adding an ethereum keypair', async () => {
      const mneumonic = 'pear outside bone car depend dentist evil arrive rhythm price stand off';
      const hdPath = "m/44'/60'/0'/0/0";
      const keypair = await ethereumExtensions.mnemonicToKeypair(mneumonic, hdPath);

      const wallet = new TransmuteDIDWallet(JSON.parse(fs.readFileSync(fullWalletPath).toString()));

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
      expect(schema.validator.isValid(wallet.data, schema.schemas.didWalletPlaintext)).toBe(
        true,
      );
      fs.writeFileSync(fullWalletPath, stringify(wallet.data, null, 2));
    });

    it('supports adding an orbitdb keypair', async () => {
      const keypair = {
        publicKey:
          '04c44cb158a11cd03f30b713276faf8cf8869fccb2a48662dc43fcde61af5008040270257a3734f47acbb1bf2def85b7a4c0d213ab634bc2e79dbc4c1916d45a4f',
        privateKey: 'ef3ff305e9492fa7904eb3c671df5f683c68548153bc8d6cf2dc663f06e13dfe',
      };

      const wallet = new TransmuteDIDWallet(JSON.parse(fs.readFileSync(fullWalletPath).toString()));

      await wallet.addKey(keypair, 'assymetric', {
        version: `elliptic@${pack.dependencies.elliptic}`,
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
      expect(schema.validator.isValid(wallet.data, schema.schemas.didWalletPlaintext)).toBe(
        true,
      );
      fs.writeFileSync(fullWalletPath, stringify(wallet.data, null, 2));
    });

    it('supports adding a libsodium signing key', async () => {
      const wallet = new TransmuteDIDWallet(JSON.parse(fs.readFileSync(fullWalletPath).toString()));
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
      expect(schema.validator.isValid(wallet.data, schema.schemas.didWalletPlaintext)).toBe(
        true,
      );
      fs.writeFileSync(fullWalletPath, stringify(wallet.data, null, 2));
    });

    it('supports adding a libsodium symmetric key', async () => {
      const wallet = new TransmuteDIDWallet(JSON.parse(fs.readFileSync(fullWalletPath).toString()));
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
      expect(schema.validator.isValid(wallet.data, schema.schemas.didWalletPlaintext)).toBe(
        true,
      );
      fs.writeFileSync(fullWalletPath, stringify(wallet.data, null, 2));
    });

    it('supports adding a shamir share', async () => {
      const wallet = new TransmuteDIDWallet(JSON.parse(fs.readFileSync(fullWalletPath).toString()));

      const shares = [
        '80157b05ca9edcc16c089ebb36c5ab9b63a84f495e716b23e04ff993ab0813fdfcb6743ab939ce638a6a2e82fd35c33caf8',
        '802b468204d5795c89c8f4d84917a768971dfbd9e09278ab0254a03879f3cb54019f1a96a7cc6f51828253f8b92b5abf664',
        '803e3d87ce4ba59de5c06a637fd20cf3f4a3b22ebbd9ac84412984dd198d242413088e2b50fff4b575f473eb7c35b1ed2d0',
        '8041d841a92d4773a2139b8ce06eb88c8f9b629765b25db38e2bc5fa67fbb30b597a98b863027084a62932f995083a98375',
        '8054a34463b39bb2ce1b0537d6ab1317ec252b603ef9899ccd56e11f07855c7b4bed0c059431eb60515f12ea5016d1ca7c1',
      ];

      await wallet.addKey(shares[0], 'shamir-share', {
        version: `secrets.js-grempe@${pack.dependencies['secrets.js-grempe']}`,
        tags: ['shamir share', 'macbook pro'],
        notes: 'created for testing purposes (3/5)',
      });

      //   eslint-disable-next-line
      const kid = sha3_256(shares[0]);
      expect(wallet.data.keystore[kid].data).toEqual(shares[0]);
      expect(schema.validator.isValid(wallet.data, schema.schemas.didWalletPlaintext)).toBe(
        true,
      );
      fs.writeFileSync(fullWalletPath, stringify(wallet.data, null, 2));
    });
  });

  describe('encrypt', () => {
    it('supports encryption with a passphrase', async () => {
      const wallet = new TransmuteDIDWallet(JSON.parse(fs.readFileSync(fullWalletPath).toString()));
      await wallet.encrypt(passphrase);
      expect(wallet.data.keystore.nonce).toBeDefined();
      expect(schema.validator.isValid(wallet.data, schema.schemas.didWalletCiphertext)).toBe(
        true,
      );
      fs.writeFileSync(cipherTextWalletPath, stringify(wallet.data, null, 2));
    });
  });

  describe('decrypt', () => {
    it('supports decryption with a passphrase', async () => {
      const wallet = new TransmuteDIDWallet(
        JSON.parse(fs.readFileSync(cipherTextWalletPath).toString()),
      );
      await wallet.decrypt(passphrase);
      expect(wallet.data.keystore.nonce).toBeUndefined();
      expect(schema.validator.isValid(wallet.data, schema.schemas.didWalletPlaintext)).toBe(
        true,
      );
      fs.writeFileSync(recoveredPlaintextWalletPath, stringify(wallet.data, null, 2));
    });
  });
});

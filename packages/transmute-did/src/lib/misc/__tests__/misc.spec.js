const misc = require("../index");
const pgp = require("../../pgp");
const msg = require("../../msg");

const key = "606be053abf0ca332dd76cb76fc8dee21e0874e0a55877d1c0e91382b286ee4c";

const shares = [
  "80157b05ca9edcc16c089ebb36c5ab9b63a84f495e716b23e04ff993ab0813fdfcb6743ab939ce638a6a2e82fd35c33caf8",
  "802b468204d5795c89c8f4d84917a768971dfbd9e09278ab0254a03879f3cb54019f1a96a7cc6f51828253f8b92b5abf664",
  "803e3d87ce4ba59de5c06a637fd20cf3f4a3b22ebbd9ac84412984dd198d242413088e2b50fff4b575f473eb7c35b1ed2d0",
  "8041d841a92d4773a2139b8ce06eb88c8f9b629765b25db38e2bc5fa67fbb30b597a98b863027084a62932f995083a98375",
  "8054a34463b39bb2ce1b0537d6ab1317ec252b603ef9899ccd56e11f07855c7b4bed0c059431eb60515f12ea5016d1ca7c1"
];

describe("misc", () => {
  describe("shatterKey", () => {
    it("should breakup a key in shares", async () => {
      expect.assertions(1);
      const shares = await misc.shatterKey({
        key,
        shareNumber: 5,
        shareThreshold: 3
      });
      expect(shares.length).toBe(5);
    });
  });

  describe("recoverKey", () => {
    it("should recover a key from shares", async () => {
      expect.assertions(1);
      const recoveredKey = await misc.recoverKey({
        shares: shares.splice(0, 3)
      });
      expect(recoveredKey).toBe(key);
    });

    it("should fail to recover a key from incorrect number of shares", async () => {
      expect.assertions(1);
      const recoveredKey = await misc.recoverKey({
        shares: shares.splice(0, 2)
      });
      expect(recoveredKey !== key).toBe(true);
    });
  });

  describe("publicKeysToDIDDocument", () => {
    let didDocument;
    let primaryPublicKey;

    beforeAll(async() => {
      const pgpKeypair = await pgp.generateOpenPGPArmoredKeypair({
        name: "bob",
        passphrase: "yolo"
      });
      const libSodiumSigningKeypair = await msg.generateCryptoSignKeypair();
      const libSodiumEncryptionKeypair = await msg.generateCryptoBoxKeypair();
      primaryPublicKey = libSodiumSigningKeypair.publicKey;
      const didDocumentArgs = {
        primaryPublicKey,
        pgpPublicKey: pgpKeypair.publicKey,
        libSodiumPublicSigningKey: libSodiumSigningKeypair.publicKey,
        libSodiumPublicEncryptionKey: libSodiumEncryptionKeypair.publicKey
      };

      didDocument = await misc.publicKeysToDIDDocument(didDocumentArgs);
    })

    it("should generate a DID Document from public keys", async () => {
      expect.assertions(1);
      expect(didDocument).toBeDefined();
    });

    // For reference: https://w3c-ccg.github.io/did-spec/#did-documents
    describe('W3C v1 compliance', () => {
      describe('DID context', () => {
        let didContext;

        beforeAll(() => {
          didContext = didDocument["@context"];
        });

        it('should be defined', () => {
          expect(didContext).toBeDefined();
        });

        it('should be valid', () => {
          expect(didContext).toBe("https://w3id.org/did/v1");
        });
      });

      describe('DID subject', () => {
        let didSubject;

        beforeAll(async() => {
          didSubject = didDocument['id'];
        })

        it('should be valid', () => {
          const didRegex = /^did:tst:.+/
          expect(didSubject).toMatch(didRegex);
        });

        it('should be equal to the registered DID', async () => {
          const registeredDid = misc.publicKeyToTransmuteDID({
            publicKey: primaryPublicKey
          });
          expect(didSubject).toBe(registeredDid);
        });
      });
    });
  });

  describe("keypairsToTransmuteCiphertextDIDWallet", () => {
    it("should generate a DID Wallet from keys", async () => {
      expect.assertions(2);
      const pgpKeypair = await pgp.generateOpenPGPArmoredKeypair({
        name: "bob",
        passphrase: "yolo"
      });
      const libSodiumSigningKeypair = await msg.generateCryptoSignKeypair();
      const libSodiumEncryptionKeypair = await msg.generateCryptoBoxKeypair();

      const cipherTextWallet = await misc.keypairsToTransmuteCiphertextDIDWallet(
        {
          primaryKeypair: libSodiumSigningKeypair,
          pgpKeypair: pgpKeypair,
          libSodiumSigningKeypair: libSodiumSigningKeypair,
          libSodiumEncryptionKeypair: libSodiumEncryptionKeypair,
          password: "yolo"
        }
      );

      expect(cipherTextWallet.salt).toBeDefined();
      expect(cipherTextWallet.wallet).toBeDefined();
    });
  });
});

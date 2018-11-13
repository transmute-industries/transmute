const sodiumExtensions = require("../index");

const aliceSign = {
  publicKey: "9f183c3fcd8d91603f4c754023305018911038a563ba6d15e7041b2bf52b6e4f",
  privateKey:
    "20ba85def3818e8f82944feabc6bf97e5d4e30775b2ff0fc05d72d92947743ec9f183c3fcd8d91603f4c754023305018911038a563ba6d15e7041b2bf52b6e4f",
  keyType: "ed25519"
};

const bobSign = {
  publicKey: "4a3267b5124ef5885dd0793cf8698e70114f723397a5581774b35203ba852fe9",
  privateKey:
    "62312b941a26b09bbe341a5a046d265ff993a0722444a32ecc77d10e6e1295f54a3267b5124ef5885dd0793cf8698e70114f723397a5581774b35203ba852fe9",
  keyType: "ed25519"
};

const aliceBox = {
  publicKey: "9935faa5dd716ca1e52692d3322e7aad8c1a086bbfbe46f40f69283efcef7332",
  privateKey:
    "984a4331664bff5064d4f1fe2353e5dea70e44db6653c88261c243bed7c84678",
  keyType: "x25519"
};

const bobBox = {
  publicKey: "860566a38d8ed69179be6d82caaa9d3337ae1b62864e282ddb79c7423583d261",
  privateKey:
    "14160928814744a31487e248a9de03507b9d678867231a13080beb8db62984b5",
  keyType: "x25519"
};

const message = "hello";

const key = "606be053abf0ca332dd76cb76fc8dee21e0874e0a55877d1c0e91382b286ee4c";

describe("sodiumExtensions", () => {
  describe("generateCryptoBoxKeypair", () => {
    it("should generate an hex x25519 key pair", async () => {
      expect.assertions(3);
      const keyPair = await sodiumExtensions.generateCryptoBoxKeypair();
      expect(keyPair.publicKey).toBeDefined();
      expect(keyPair.privateKey).toBeDefined();
      expect(keyPair.keyType).toBe("x25519");
    });
  });

  describe("generateCryptoSignKeypair", () => {
    it("should generate an hex Ed25519 key pair", async () => {
      expect.assertions(3);
      const keyPair = await sodiumExtensions.generateCryptoSignKeypair();
      expect(keyPair.publicKey).toBeDefined();
      expect(keyPair.privateKey).toBeDefined();
      expect(keyPair.keyType).toBe("ed25519");
    });
  });

  describe("generateSalt", () => {
    it("should generate a salt", async () => {
      expect.assertions(1);
      const salt = await sodiumExtensions.generateSalt();
      expect(salt.length).toBe(32);
    });
  });

  describe("generateSymmetricKeyFromPasswordAndSalt", () => {
    it("should generate an symmetric key from a password and salt", async () => {
      expect.assertions(1);
      const password = "thanos did nothing wrong";
      const salt = await sodiumExtensions.generateSalt();
      const key = await sodiumExtensions.generateSymmetricKeyFromPasswordAndSalt({
        password,
        salt
      });
      expect(key.length).toBe(64);
    });
  });

  describe("signDetached", () => {
    it("should sign a message with a private key", async () => {
      expect.assertions(1);
      const keyPair = aliceSign;

      const signature = await sodiumExtensions.signDetached({
        message,
        privateKey: keyPair.privateKey
      });
      expect(signature.length).toBe(128);
    });
  });

  describe("verifyDetached", () => {
    it("should verify a message was signed with a public key", async () => {
      expect.assertions(1);
      const keyPair = aliceSign;

      const signature =
        "bf6a7cd62d37c8f3bde61ac35535d741fa018eac502209f5197f3f66d36e5a521bd6a9464bbedf343f94a323d21d5acb609e1f5006d7b0f8755886ffc2e87c04";
      const verified = await sodiumExtensions.verifyDetached({
        message,
        signature,
        publicKey: keyPair.publicKey
      });
      expect(verified).toBe(true);
    });
  });

  describe("encryptFor", () => {
    it("should authenticated encrypt message from privateKey to publicKey", async () => {
      expect.assertions(1);

      const cipherText = await sodiumExtensions.encryptFor({
        message,
        publicKey: bobBox.publicKey,
        privateKey: aliceBox.privateKey
      });
      expect(cipherText.nonce.length).toBe(48);
    });
  });

  describe("decryptFor", () => {
    it("should authenticated decrypt message from privateKey from publicKey", async () => {
      expect.assertions(1);
      const cipherText = {
        nonce: "5d7a7adc54cce8f51ddc41121270a5427d40da2a83f577be",
        encrypted: "f1b1227e6b770c81efec743b616f0a4f6f6217d06e"
      };

      const plainText = await sodiumExtensions.decryptFor({
        message: cipherText,
        publicKey: aliceBox.publicKey,
        privateKey: bobBox.privateKey
      });

      expect(plainText).toBe(message);
    });
  });

  describe("encryptWith", () => {
    it("should symmetric encrypt with data with key", async () => {
      expect.assertions(1);
      const cipherText = await sodiumExtensions.encryptWith({
        data: "hi",
        key
      });
      expect(cipherText.nonce.length).toBe(48);
    });
  });

  describe("decryptWith", () => {
    it("should symmetric decrypt with data with key", async () => {
      expect.assertions(1);
      const cipherText = {
        nonce: "ebac5573a16c985a1fb5d721b578d554820fa19160781811",
        encrypted: "202e4630090c666987e8062599426e7339a8"
      };
      const plainText = await sodiumExtensions.decryptWith({
        data: cipherText,
        key
      });
      expect(plainText).toBe("hi");
    });
  });

  describe("encryptJson", () => {
    it("should encrypt json with a symmetric key", async () => {
      expect.assertions(2);

      const data = {
        yolo: 1
      };
      const cipherText = await sodiumExtensions.encryptJson({
        data,
        key
      });
      expect(cipherText.nonce.length).toBe(48);
      expect(cipherText.encrypted.length).toBe(52);
    });
  });

  describe("decryptJson", () => {
    it("should decrypt json with a symmetric key", async () => {
      expect.assertions(1);
      const cipherText = {
        nonce: "2c4c79bc9e85dcd1250ffa498f234793d7f0c37d90bc7d27",
        encrypted: "f19fd16b6e032752fabdc66a787815e07eb5fea8bbd954a2101c"
      };
      const plainText = await sodiumExtensions.decryptJson({
        data: cipherText,
        key
      });
      expect(plainText.yolo).toBe(1);
    });
  });
});

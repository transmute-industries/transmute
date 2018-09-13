const secrets = require("secrets.js-grempe");

const msg = require("../msg");

const { keccak256 } = require("js-sha3");

const shatterKey = async ({ key, shareNumber, shareThreshold }) => {
  return secrets.share(key, shareNumber, shareThreshold);
};

const recoverKey = async ({ shares }) => {
  return secrets.combine(shares);
};

const publicKeyToTransmuteDID = ({ publicKey }) =>
  `did:tst:0x${keccak256(publicKey)}`;

const publicKeysToDIDDocument = ({
  primaryPublicKey,
  pgpPublicKey,
  libSodiumPublicSigningKey,
  libSodiumPublicEncryptionKey
}) => {
  const did = publicKeyToTransmuteDID({
    publicKey: primaryPublicKey
  });

  return {
    "@context": "https://w3id.org/did/v1",
    id: did,
    publicKey: [
      {
        id: `${did}#keys-0`,
        type: "x25519VerificationKey2018",
        owner: did,
        publicKey: libSodiumPublicEncryptionKey
      },
      {
        id: `${did}#keys-1`,
        type: "Ed25519VerificationKey2018",
        owner: did,
        publicKey: libSodiumPublicSigningKey
      },
      {
        id: `${did}#keys-2`,
        type: "Secp256k1VerificationKey2018",
        owner: did,
        publicKeyPem: pgpPublicKey
      },
      {
        id: `${did}#keys-3`,
        type: "Ed25519VerificationKey2018",
        owner: did,
        publicKey: primaryPublicKey
      }
    ],
    authentication: [
      {
        type: "Ed25519SignatureAuthentication2018",
        publicKey: `${did}#keys-1`
      }
    ]
  };
};

const keypairsToTransmuteCiphertextDIDWallet = async ({
  primaryKeypair,
  pgpKeypair,
  libSodiumSigningKeypair,
  libSodiumEncryptionKeypair,
  password
}) => {
  const plainTextWallet = {
    primaryKeypair,
    pgpKeypair,
    libSodiumSigningKeypair,
    libSodiumEncryptionKeypair
  };

  const salt = await msg.generateSalt();

  const key = await msg.generateSymmetricKeyFromPasswordAndSalt({
    password,
    salt
  });

  const cipherTextWallet = {
    salt,
    wallet: await msg.encryptJson({
      data: plainTextWallet,
      key
    })
  };

  return cipherTextWallet;
};

module.exports = {
  shatterKey,
  recoverKey,
  publicKeysToDIDDocument,
  keypairsToTransmuteCiphertextDIDWallet
};

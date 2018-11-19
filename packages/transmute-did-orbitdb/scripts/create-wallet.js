const fs = require("fs");
const path = require("path");
const transmuteDID = require("@transmute/transmute-did");
const pack = require("@transmute/transmute-did/package.json");

(async () => {
  //   console.log("creating wallet...");
  let wallet = await transmuteDID.wallet.createWallet();

  let keypair = await transmuteDID.openpgpExtensions.cryptoHelpers.generateArmoredKeypair(
    {
      name: "test-key",
      passphrase: "yolo"
    }
  );

  await wallet.addKey(keypair, "assymetric", {
    version: `openpgp@${pack.dependencies.openpgp}`,
    tags: ["OpenPGP.js", "macbook pro"],
    notes: "created for testing purposes",
    did: {
      publicKey: true,
      authentication: true,
      publicKeyType: "publicKeyPem",
      signatureType: "Secp256k1VerificationKey2018"
    }
  });

  keypair = await transmuteDID.ellipticExtensions.createKeypair();

  await wallet.addKey(keypair, "assymetric", {
    version: `elliptic@${pack.dependencies.elliptic}`,
    tags: ["OrbitDB", "macbook pro"],
    notes: "created for testing purposes",
    did: {
      publicKey: true,
      authentication: true,
      publicKeyType: "publicKeyHex",
      signatureType: "Secp256k1VerificationKey2018"
    }
  });

  fs.writeFileSync(
    path.resolve(__dirname, "../wallet/plaintext.json"),
    JSON.stringify(wallet.data, null, 2)
  );

  console.log("👛  created ./wallet/plaintext.json");
})();

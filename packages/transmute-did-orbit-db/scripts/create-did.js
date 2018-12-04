const fs = require("fs");
const path = require("path");
const transmuteDID = require("@transmute/transmute-did");

const { createOrbitDIDFromWallet } = require("./utils/orbitHelpers");

(async () => {
  try {
    // console.log("creating orbit db did...", ipfsOptions);
    const wallet = new transmuteDID.wallet.TransmuteDIDWallet(
      JSON.parse(
        fs
          .readFileSync(path.resolve(__dirname, "../wallet/ciphertext.json"))
          .toString()
      )
    );

    if (!process.argv[2]) {
      throw new Error("You must supply a password for your openpgp key.");
    }

    const password = process.argv[2];

    await wallet.decrypt(password);

    const { did_document } = await createOrbitDIDFromWallet(wallet, password);

    fs.writeFileSync(
      path.resolve(__dirname, "../src/data/did_document.json"),
      JSON.stringify(did_document, null, 2)
    );
    
  } catch (e) {
    console.error(e);
  }
})();

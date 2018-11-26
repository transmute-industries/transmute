const fs = require("fs");
const path = require("path");
const transmuteDID = require("@transmute/transmute-did");

const {
  ipfsOptions,
  orbitdbAddressToDID,
  orbitDBDIDToOrbitDBAddress,
  getOrbitDBFromKeypair
} = require("./utils/orbitHelpers");

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

    const openPGPKID = Object.keys(wallet.data.keystore)[0];

    const orbitKID = Object.keys(wallet.data.keystore)[1];

    // here we need to ensure that the did is generated correctly,
    // so that kid's for signatures will resolve...
    const { object, signature, meta } = await wallet.toDIDDocument(
      openPGPKID,
      password
    );

    const orbitKeypair = wallet.data.keystore[orbitKID].data;

    const orbitdb = await getOrbitDBFromKeypair(ipfsOptions, orbitKeypair);

    const db = await orbitdb.docs(object.id, {
      write: [
        // Give access to our did wallet private key
        orbitdb.key.getPublic("hex")
      ]
    });

    const address = db.address.toString();
    const orbitDID = orbitdbAddressToDID(address);

    console.log("\n🔗 Orbit DID: ", orbitDID);

    const hash = await db.put({
      _id: object.id,
      object,
      signature,
      meta
    });

    fs.writeFileSync(
      path.resolve(__dirname, "../src/data/did_document.json"),
      JSON.stringify(
        {
          orbitDID,
          doc: {
            _id: object.id,
            object,
            signature,
            meta
          },
          hash
        },
        null,
        2
      )
    );
  } catch (e) {
    console.error(e);
  }
})();

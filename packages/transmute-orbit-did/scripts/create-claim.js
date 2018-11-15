const fs = require("fs");
const path = require("path");
const transmuteDID = require("@transmute/transmute-did");

const { ipfsOptions } = require("../src/constants");

const didData = require("../src/orbitdb.transmute.openpgp.did.json");

const {
  TransmuteAdapterOrbitDB
} = require("@transmute/transmute-adapter-orbit-db");

const {
  getOrbitDBFromKeypair,
  orbitdbAddressToDID,
  orbitDBDIDToOrbitDBAddress,
  createOrbitDIDResolver
} = require("./orbitHelpers");

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

    const password = "password123";

    await wallet.decrypt(password);

    const openPGPKID = Object.keys(wallet.data.keystore)[0];

    const orbitKID = Object.keys(wallet.data.keystore)[1];

    const result = await wallet.toDIDDocument(openPGPKID, "yolo");

    const claim = {
      //   eslint-disable-next-line
      subject: didData.orbitDID,
      claims: {
        isTruckDriver: true,
        isInvestor: true,
        isDoctor: false
      }
    };
    //   eslint-disable-next-line
    const { object, signature, meta } = await wallet.signObject({
      obj: claim,
      kid: openPGPKID,
      passphrase: "yolo",
      asDIDByKID: openPGPKID,
      asDIDByKIDPassphrase: "yolo",
      overwriteKID: `${didData.orbitDID}#${openPGPKID}`
    });

    // console.log({ object, signature, meta });

    const orbitKeypair = wallet.data.keystore[orbitKID].data;
    const orbitdb = await getOrbitDBFromKeypair(ipfsOptions, orbitKeypair);

    const adapter = new TransmuteAdapterOrbitDB(orbitdb);

    //   console.log(adapter);
    const address = await orbitDBDIDToOrbitDBAddress(didData.orbitDID);
    //   console.log(address);
    await adapter.open(address, "docstore", {
      write: [orbitKeypair.publicKey]
    });

    const claimsAddress = adapter.db.address.toString();
    //   console.log(claimsAddress);

    const resolver = await createOrbitDIDResolver(orbitdb);

    const kidTransformRegex = /(did:(.+)\.transmute\.(.+)):(.+\.)(.+)/;

    const transform = did => {
      let result = did.match(kidTransformRegex);
      if (result) {
        //   const storageKey = result[2];
        //   const storageID = result[4];

        const maybeKIDInDID = result[5].split("#");

        const didSignatureMethod = result[3];

        const didSignatureID = maybeKIDInDID[0];
        const kid = maybeKIDInDID[1];

        let kidPart = kid ? `#${kid}` : "";

        //   console.log({
        //     storageKey,
        //     storageID,
        //     didSignatureMethod,
        //     didSignatureID,
        //     kid
        //   });
        return `did:transmute.${didSignatureMethod}:${didSignatureID}${kidPart}`;
      } else {
        return did;
      }
    };

    const signatureStore = new transmuteDID.did.SignatureStore(
      adapter,
      resolver,
      transmuteDID.did.verifyDIDSignature,
      transform
    );

    const storeObject = {
      object,
      signature,
      meta
    };
    const { objectID, signatureID } = await signatureStore.add(storeObject);

    //   console.log({ objectID, signatureID });
    fs.writeFileSync(
      path.resolve(__dirname, "../src/orbitdb.transmute.openpgp.claim.json"),
      JSON.stringify(
        {
          address: claimsAddress,
          did: didData.orbitDID,
          storeObject: {
            _id: object.id,
            object,
            signature,
            meta
          },
          objectID,
          signatureID
        },
        null,
        2
      )
    );

    console.log("\nClaim written.");

    try {
      const verified = await signatureStore.verify(
        storeObject.object,
        storeObject.signature,
        storeObject.meta
      );

      console.log("\nClaim verified: ", verified);
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    console.log(e);
  }
})();

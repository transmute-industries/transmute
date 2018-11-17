const fs = require("fs");
const path = require("path");
const transmuteDID = require("@transmute/transmute-did");

const { ipfsOptions } = require("../src/constants");

const didData = require("../src/orbitdb.transmute.openpgp.did.json");

const {
  getReadyIPFS,
  getOrbitDBFromKeypair,
  TransmuteAdapterOrbitDB
} = require("@transmute/transmute-adapter-orbit-db");

const {
  orbitDBDIDToOrbitDBAddress,
  createOrbitDIDResolver,
  createOrbitClaimResolver,
  transform
} = transmuteDID.did.orbitDID;

const { SignatureStore, verifyDIDSignature } = transmuteDID.did;

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

    const orbitKeypair = wallet.data.keystore[orbitKID].data;

    const ipfs = await getReadyIPFS(ipfsOptions);
    const orbitdb = await getOrbitDBFromKeypair(ipfs, orbitKeypair);

    const adapter = new TransmuteAdapterOrbitDB(orbitdb);
    const address = await orbitDBDIDToOrbitDBAddress(didData.orbitDID);
    await adapter.open(address);

    const claimAddress = adapter.db.address.toString();
    const resolver = await createOrbitDIDResolver(orbitdb, verifyDIDSignature);

    const signatureStore = new SignatureStore(
      adapter,
      resolver,
      verifyDIDSignature,
      transform
    );

    const storeObject = {
      object,
      signature,
      meta
    };

    const { signatureID } = await signatureStore.add(storeObject);

    const claimResolver = createOrbitClaimResolver(
      orbitdb,
      TransmuteAdapterOrbitDB,
      SignatureStore,
      verifyDIDSignature
    );

    const resolvedClaim = await claimResolver.resolve(
      didData.orbitDID,
      signatureID
    );

    const verifiedClaim = await signatureStore.verify(
      resolvedClaim.object,
      resolvedClaim.signature,
      resolvedClaim.meta
    );

    console.log("\n🔗 Created, Uploaded, Resolved and Verified Claim");

    fs.writeFileSync(
      path.resolve(__dirname, "../src/orbitdb.transmute.openpgp.claim.json"),
      JSON.stringify(
        {
          address: claimAddress,
          did: didData.orbitDID,
          storeObject: {
            _id: object.id,
            object,
            signature,
            meta
          },
          signatureID,
          verifiedClaim
        },
        null,
        2
      )
    );
  } catch (e) {
    console.error(e);
  }
})();

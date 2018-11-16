const transmuteDID = require("@transmute/transmute-did");
const {
  TransmuteAdapterOrbitDB
} = require("@transmute/transmute-adapter-orbit-db");


const OrbitDB = require("orbit-db");

const CustomTestKeystore = transmuteDID.ellipticExtensions.CustomTestKeystore;

const claimData = require("./orbitdb.transmute.openpgp.claim.json");

const getOrbitDBFromKeypair = async (ipfsOptions, keypair) => {
  const ipfs = new window.Ipfs(ipfsOptions);

  return new Promise((resolve, reject) => {
    ipfs.on("ready", async () => {
      // console.log("keypair: ", keypair);
      const keystore = new CustomTestKeystore(keypair);
      // Create OrbitDB instance
      const orbitdb = new OrbitDB(ipfs, "./orbitdb", {
        peerID: keypair.publicKey,
        keystore: keystore
      });

      resolve(orbitdb);
    });
  });
};

const orbitdbAddressToDID = address => {
  const parts = address.split("did:transmute.");
  const orbitAddress = parts[0].replace("/orbitdb/", "").replace("/", "");
  const didSignatureMethod = parts[1].split(":")[0];
  const didSignatureID = parts[1].split(":")[1];
  return `did:orbitdb.transmute.${didSignatureMethod}:${orbitAddress}.${didSignatureID}`.trim();
};

const orbitDBDIDToOrbitDBAddress = orbitDID => {
  const parts = orbitDID.split(".");
  const didParts = parts[2].split(":");
  const orbitAddress = didParts[1];
  return `/orbitdb/${orbitAddress}/did:transmute.${didParts[0]}:${
    parts[parts.length - 1]
  }`.trim();
};

const createOrbitDIDResolver = orbitdb => {
  return {
    resolve: async orbitDID => {
      const address = orbitDBDIDToOrbitDBAddress(orbitDID);
      let db = await orbitdb.open(address);
      await db.load();
      const doc = db.get(db.dbname);

      const { object, signature, meta } = doc[0];
      // console.log({ object, signature, meta });

      // did doc signatures do not contain a did reference
      // here we hack the kid to be correct so verify will select the correct key
      meta.kid = `${object.id}#${meta.kid}`;

      const success = await transmuteDID.did.verifyDIDSignature(
        object,
        signature,
        meta,
        object
      );

      if (!success) {
        throw new Error("Signature verifcation failed.");
      } else {
        console.log("doc signature verified");
      }
      return object;
    }
  };
};

const createOrbitClaimResolver = orbitdb => {
  const adapter = new TransmuteAdapterOrbitDB(orbitdb);
  const resolver = createOrbitDIDResolver(orbitdb);

  // console.log(orbitDID);

  //   console.log(adapter);
  //
  // //   console.log(address);

  return {
    resolve: async (orbitDID, signatureID) => {
      const address = await orbitDBDIDToOrbitDBAddress(orbitDID);
      const doc = await resolver.resolve(orbitDID);

      console.log("verifying claim, resolving did doc...", doc);

      const publicKey = doc.publicKey[1].publicKeyHex;

      console.log("verifying claim, resolving did doc...", publicKey);

      await adapter.open(address);

      console.log("claimAddress ", adapter.db.address.toString());

      await adapter.db.load();

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

      // console.log(signatureStore);
      console.log("loading signature...");

      const storeObject = await signatureStore.getBySignatureID(signatureID);

      console.log("loaded signature...", storeObject);

      return storeObject;
    }
  };
};

export {
  getOrbitDBFromKeypair,
  orbitdbAddressToDID,
  orbitDBDIDToOrbitDBAddress,
  createOrbitDIDResolver,
  createOrbitClaimResolver
};

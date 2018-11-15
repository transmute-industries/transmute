const transmuteDID = require("@transmute/transmute-did");
const IPFS = require("ipfs");
const OrbitDB = require("orbit-db");
const CustomTestKeystore = transmuteDID.ellipticExtensions.CustomTestKeystore;

const getOrbitDBFromKeypair = async (ipfsOptions, keypair) => {
  const ipfs = new IPFS(ipfsOptions);

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

export {
  getOrbitDBFromKeypair,
  orbitdbAddressToDID,
  orbitDBDIDToOrbitDBAddress,
  createOrbitDIDResolver
};

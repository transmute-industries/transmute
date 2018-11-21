const {
  TransmuteAdapterOrbitDB,
  CustomTestKeystore
} = require("@transmute/transmute-adapter-orbit-db");

const transmuteDID = require("@transmute/transmute-did");

const OrbitDB = require("orbit-db");

const publicKeyKIDPrefix = "kid=";
const constructDIDPublicKeyID = (did, kid) =>
  `${did}#${publicKeyKIDPrefix}${kid}`;

const orbitdbAddressToDID = address => {
  const parts = address.split("did:transmute.");
  const orbitAddress = parts[0].replace("/orbitdb/", "").replace("/", "");
  const didSignatureMethod = parts[1].split(":")[0];
  const didSignatureID = parts[1].split(":")[1];
  return `did:orbitdb.transmute.${didSignatureMethod}:${orbitAddress}.${didSignatureID}`.trim();
};

const orbitDBDIDToOrbitDBAddress = orbitDID => {
  // we exclude the fragment when converting a did.
  //   eslint-disable-next-line
  orbitDID = orbitDID.split("#")[0];
  const parts = orbitDID.split(".");
  const didParts = parts[2].split(":");
  const orbitAddress = didParts[1];
  return `/orbitdb/${orbitAddress}/did:transmute.${didParts[0]}:${
    parts[parts.length - 1]
  }`.trim();
};

const createOrbitDIDResolver = (orbitdb, verifyDIDSignature) => ({
  resolve: async orbitDID => {
    const address = orbitDBDIDToOrbitDBAddress(orbitDID);
    const db = await orbitdb.open(address);
    await db.load();
    const doc = db.get(db.dbname);

    const { object, signature, meta } = doc[0];
    // console.log({ object, signature, meta });

    // did doc signatures do not contain a did reference
    // here we hack the kid to be correct so verify will select the correct key
    meta.kid = constructDIDPublicKeyID(object.id, meta.kid);

    const success = await verifyDIDSignature(object, signature, meta, object);

    if (!success) {
      throw new Error("Signature verifcation failed.");
    } else {
      // console.log("doc signature verified");
    }
    return object;
  }
});

const kidTransformRegex = /(did:(.+)\.transmute\.(.+)):(.+\.)(.+)/;
const transform = did => {
  const result = did.match(kidTransformRegex);
  if (result) {
    const maybeKIDInDID = result[5].split("#");
    const didSignatureMethod = result[3];
    const didSignatureID = maybeKIDInDID[0];
    const kid = maybeKIDInDID[1];
    const kidPart = kid ? `#${publicKeyKIDPrefix}${kid}` : "";
    return `did:transmute.${didSignatureMethod}:${didSignatureID}${kidPart}`;
  }
  return did;
};

const createOrbitClaimResolver = (
  orbitdb,
  TransmuteAdapterOrbitDB,
  SignatureStore,
  verifyDIDSignature
) => {
  const adapter = new TransmuteAdapterOrbitDB(orbitdb);
  const resolver = createOrbitDIDResolver(orbitdb, verifyDIDSignature);
  return {
    resolve: async (orbitDID, signatureID) => {
      const address = await orbitDBDIDToOrbitDBAddress(orbitDID);
      await adapter.open(address);
      await adapter.db.load();
      const signatureStore = new SignatureStore(
        adapter,
        resolver,
        verifyDIDSignature,
        transform
      );
      const storeObject = await signatureStore.getBySignatureID(signatureID);
      return storeObject;
    }
  };
};

const ipfsOptions = {
  repo: "/orbitdb/examples/browser/new/ipfs/0.27.3",
  start: true,
  EXPERIMENTAL: {
    pubsub: true
  },
  config: {
    Addresses: {
      Swarm: [
        // Use IPFS dev signal server
        // '/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star',
        "/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star"
        // Use local signal server
        // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
      ]
    }
  }
};

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

module.exports = {
  transmuteDID,
  ipfsOptions,
  TransmuteAdapterOrbitDB,
  getOrbitDBFromKeypair,
  orbitdbAddressToDID,
  orbitDBDIDToOrbitDBAddress,
  createOrbitDIDResolver,
  createOrbitClaimResolver,
  kidTransformRegex,
  transform
};

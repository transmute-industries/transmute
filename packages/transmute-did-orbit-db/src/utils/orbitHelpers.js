const OrbitDB = require("orbit-db");

const {
  TransmuteAdapterOrbitDB,
  CustomTestKeystore
} = require("@transmute/transmute-adapter-orbit-db");

const {
  SignatureStore,
  verifyDIDSignature,
  constructDIDPublicKeyID,
  transformNestedDIDToDID
} = require("@transmute/transmute-did");

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
    const doc = await db.get(db.dbname);

    if (doc.length) {
      const { object, signature, meta } = doc[0];
      
      // did doc signatures do not contain a did reference
      // here we hack the kid to be correct so verify will select the correct key
      meta.kid = constructDIDPublicKeyID(object.id, meta.kid);

      if (verifyDIDSignature) {
        const success = await verifyDIDSignature(
          object,
          signature,
          meta,
          object
        );

        if (!success) {
          throw new Error("Signature verifcation failed.");
        } else {
          console.log("DID DOC signature verified on client!");
        }
      }

      return object;
    } else {
      console.error("unable to get did document.");
    }
  }
});

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
        transformNestedDIDToDID
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
      const orbitOptions = keypair
        ? {
            peerID: keypair.publicKey,
            keystore: new CustomTestKeystore(keypair)
          }
        : undefined;

      // Create OrbitDB instance
      const orbitdb = new OrbitDB(ipfs, "./orbitdb", orbitOptions);

      resolve(orbitdb);
    });
  });
};

export {
  ipfsOptions,
  orbitdbAddressToDID,
  orbitDBDIDToOrbitDBAddress,
  TransmuteAdapterOrbitDB,
  CustomTestKeystore,
  getOrbitDBFromKeypair,
  createOrbitDIDResolver,
  createOrbitClaimResolver,
  verifyDIDSignature,
  SignatureStore
};

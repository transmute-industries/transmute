const OrbitDB = require("orbit-db");

const _ = require("lodash");

const {
  TransmuteAdapterOrbitDB,
  CustomTestKeystore
} = require("@transmute/transmute-adapter-orbit-db");

const {
  wallet,
  openpgpExtensions,
  ellipticExtensions,
  SignatureStore,
  verifyDIDSignature
} = require("@transmute/transmute-did");

const pack = require("@transmute/transmute-did/package.json");

const orbitdbAddressToDID = address => {
  const parts = address.split("did:transmute.");
  const orbitAddress = parts[0].replace("/orbitdb/", "").replace("/", "");
  const didSignatureMethod = parts[1].split(":")[0];
  const didSignatureID = parts[1].split(":")[1];
  return `did:orbitdb.transmute.${didSignatureMethod}:${orbitAddress}.${didSignatureID}`.trim();
};

const orbitDBDIDToOrbitDBAddress = orbitDID => {
  // we exclude the fragment when converting a did.
  // eslint-disable-next-line
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
    const doc = await db.get(orbitDID);

    if (doc.length) {
      const { object, signature, meta } = doc[0];

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

const createOrbitDIDWallet = async password => {
  const w = await wallet.createWallet();

  let keypair = await openpgpExtensions.cryptoHelpers.generateArmoredKeypair({
    name: "test-key",
    passphrase: password
  });

  await w.addKey(keypair, "assymetric", {
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

  keypair = await ellipticExtensions.createKeypair();

  await w.addKey(keypair, "assymetric", {
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

  return w;
};

const getOrbitDBFromKeypair = async keypair => {
  if (window.orbitdb && !keypair) {
    return Promise.resolve(window.orbitdb);
  }

  if (keypair) {
    ipfsOptions.repo = "orbitdb/did/" + keypair.publicKey;
  }

  const ipfs = new window.Ipfs(ipfsOptions);

  return new Promise((resolve, reject) => {
    ipfs.on("ready", async () => {
      const orbitOptions = keypair
        ? {
            peerID: keypair.publicKey,
            keystore: new CustomTestKeystore(keypair)
          }
        : undefined;

      const orbitdb = new OrbitDB(ipfs, "./orbitdb", orbitOptions);
      if (!window.orbitdb && !keypair) {
        window.orbitdb = orbitdb;
      }
      resolve(orbitdb);
    });
  });
};
const getOrbitDBFromWallet = async w => {
  const orbitKID = Object.keys(w.data.keystore)[1];
  const keypair = w.data.keystore[orbitKID].data;
  const orbitdb = await getOrbitDBFromKeypair(keypair);
  return orbitdb;
};

const createOrbitDIDFromWallet = async (w, password) => {
  const openPGPKID = Object.keys(w.data.keystore)[0];
  const orbitKID = Object.keys(w.data.keystore)[1];

  let rawDocument = await w.toDIDDocument({
    kid: openPGPKID,
    password
  });

  const orbitdb = await getOrbitDBFromWallet(w);
  const db = await orbitdb.docs(rawDocument.object.id, {
    write: [orbitdb.key.getPublic("hex")]
  });
  await db.load();
  const address = db.address.toString();
  const orbitDID = orbitdbAddressToDID(address);

  const doesDIDDocExist = await db.get(orbitDID);

  if (doesDIDDocExist.length) {
    console.log("DID Exists, returning.");
    return {
      wallet: w,
      did_document: doesDIDDocExist[0].object,
      password
    };
  }

  // create the did document with the correct did
  rawDocument = await w.toDIDDocument({
    did: orbitDID,
    kid: openPGPKID,
    password
  });

  await db.put({
    _id: rawDocument.object.id,
    object: rawDocument.object,
    signature: rawDocument.signature,
    meta: rawDocument.meta
  });

  const revocationsLog = await orbitdb.log("revocations", {
    write: [orbitdb.key.getPublic("hex")]
  });

  await revocationsLog.load();

  const revocationsLogAddress = revocationsLog.address.toString();

  w.data.keystore[openPGPKID].meta.did.revocations = revocationsLogAddress;
  w.data.keystore[orbitKID].meta.did.revocations = revocationsLogAddress;

  let didDocWithRevocations = await w.toDIDDocument({
    did: rawDocument.object.id,
    kid: openPGPKID,
    password
  });

  await db.put({
    _id: didDocWithRevocations.object.id,
    ...didDocWithRevocations
  });

  return {
    wallet: w,
    did_document: didDocWithRevocations.object,
    password
  };
};

const TransmuteDIDWallet = wallet.TransmuteDIDWallet;

const createOrbitClaimResolver = (
  orbitdb,
  TransmuteAdapterOrbitDB,
  SignatureStore,
  verifyDIDSignature
) => {
  const adapter = new TransmuteAdapterOrbitDB(orbitdb);
  const resolver = createOrbitDIDResolver(orbitdb, verifyDIDSignature);
  return {
    resolve: async claimID => {
      const [did, signatureID] = claimID.split("#signatureID=");
      const address = await orbitDBDIDToOrbitDBAddress(did);
      await adapter.open(address);
      await adapter.db.load();
      const signatureStore = new SignatureStore(
        adapter,
        resolver,
        verifyDIDSignature
      );
      const storeObject = await signatureStore.getBySignatureID(signatureID);
      const doc = await resolver.resolve(did);
      const isSignatureValid = await verifyDIDSignature(
        storeObject.object,
        storeObject.signature,
        storeObject.meta,
        doc
      );
      const isSignatureKeyRevoked = await isKeyRevoked(storeObject);
      return {
        claim: storeObject,
        isSignatureValid,
        isSignatureKeyRevoked
      };
    }
  };
};

const createOrbitDIDClaimFromWallet = async ({
  did,
  kid,
  claim,
  wallet,
  password
}) => {
  const { object, signature, meta } = await wallet.signObject({
    did,
    obj: claim,
    kid: kid,
    passphrase: password,
    asDIDByKID: kid,
    asDIDByKIDPassphrase: password
  });

  const orbitdb = await getOrbitDBFromWallet(wallet);

  const adapter = new TransmuteAdapterOrbitDB(orbitdb);
  const address = await orbitDBDIDToOrbitDBAddress(did);
  await adapter.open(address);
  const resolver = await createOrbitDIDResolver(orbitdb, verifyDIDSignature);

  const signatureStore = new SignatureStore(
    adapter,
    resolver,
    verifyDIDSignature
  );

  const storeObject = {
    object,
    signature,
    meta
  };

  const { signatureID } = await signatureStore.add(storeObject);

  const claimID = `${did}#signatureID=${signatureID}`;

  const claimResolver = createOrbitClaimResolver(
    orbitdb,
    TransmuteAdapterOrbitDB,
    SignatureStore,
    verifyDIDSignature
  );

  const resolvedClaim = await claimResolver.resolve(claimID);

  return {
    claimID,
    resolvedClaim
  };
};

const isKeyRevoked = async ({ object, signature, meta }) => {
  const [did, kid] = meta.kid.split("#kid=");
  const { doc } = await orbitDIDRevocationsResolver(did);
  const key = _.find(doc.publicKey, key => {
    return key.id === meta.kid;
  });
  return key.revocation !== undefined;
};

const orbitDIDRevocationsResolver = async did => {
  const orbitdb = await getOrbitDBFromKeypair();
  const resolver = await createOrbitDIDResolver(orbitdb, verifyDIDSignature);

  const doc = await resolver.resolve(did);

  const revocationsAddresses = _.uniq(
    _.map(doc.publicKey, key => {
      return key.revocations;
    })
  );

  const revocationMap = {};
  const getAllRevocationsFromAddress = async address => {
    const revocationsLog = await orbitdb.open(address);
    await revocationsLog.load();

    const allRevocations = revocationsLog
      .iterator({ limit: -1 })
      .collect()
      .map(e => {
        revocationMap[e.payload.value.kid] = e;
        return e.payload.value;
      });
    return allRevocations;
  };

  const allRevocations = _.map(
    _.flatten(
      await Promise.all(
        revocationsAddresses.map(async address => {
          return await getAllRevocationsFromAddress(address);
        })
      )
    ),
    data => {
      return data.kid;
    }
  );

  doc.publicKey.forEach(key => {
    const kid = key.id.split("#kid=")[1];
    if (allRevocations.indexOf(kid) !== -1) {
      key.revocation = revocationMap[kid];
    }
  });

  return {
    doc
  };
};

const orbitDIDResolver = orbitDIDRevocationsResolver;

const revokeKIDWithOrbitDB = async ({ kid, wallet }) => {
  const orbitdb = await getOrbitDBFromWallet(wallet);
  const db = await orbitdb.log("revocations", {
    write: [orbitdb.key.getPublic("hex")]
  });
  await db.load();
  const hash = await db.add({ kid });
  return hash;
};

const orbitDIDClaimResolver = async claimID => {
  const orbitdb = await getOrbitDBFromKeypair();
  const resolver = createOrbitClaimResolver(
    orbitdb,
    TransmuteAdapterOrbitDB,
    SignatureStore,
    verifyDIDSignature
  );
  return resolver.resolve(claimID);
};

export {
  ipfsOptions,
  getOrbitDBFromKeypair,
  TransmuteDIDWallet,
  createOrbitDIDWallet,
  createOrbitDIDFromWallet,
  verifyDIDSignature,
  orbitDIDResolver,
  orbitDIDClaimResolver,
  orbitDIDRevocationsResolver,
  createOrbitDIDClaimFromWallet,
  revokeKIDWithOrbitDB,
  isKeyRevoked
};

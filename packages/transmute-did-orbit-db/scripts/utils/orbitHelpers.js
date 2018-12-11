const OrbitDB = require("orbit-db");
const IPFS = require("ipfs");
const path = require("path");

const _ = require("lodash");

const {
  TransmuteAdapterOrbitDB,
  CustomTestKeystore
} = require("@transmute/transmute-adapter-orbit-db");

const {
  createWallet,
  TransmuteDIDWallet,
  openpgpExtensions,
  ellipticExtensions,
  SignatureStore,
  verifyDIDSignature,
  constructDIDPublicKeyID,
  publicKeyToDID,
  verifySignedLinkedData,
  verifyDIDSignatureWithResolver,
  isLinkedDataSignedByDocument
} = require("@transmute/transmute-did");

const pack = require("@transmute/transmute-did/package.json");

global.orbitdb = null;

const ipfsOptions = {
  repo: path.resolve(__dirname, "../../orbitdb/ipfs-data"),
  start: true,
  EXPERIMENTAL: {
    pubsub: true
  },
  config: {
    Addresses: {
      Swarm: [
        "/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star"
      ]
    }
  }
};

const getOrbitDBFromKeypair = async keypair => {
  // eslint-disable-next-line
  if (orbitdb) {
    // eslint-disable-next-line
    return Promise.resolve(orbitdb);
  }
  return new Promise((resolve, reject) => {
    const ipfs = new IPFS(ipfsOptions);

    ipfs.on("ready", async () => {
      const orbitOptions = keypair
        ? {
            peerID: keypair.publicKey,
            keystore: new CustomTestKeystore(keypair)
          }
        : undefined;

      // eslint-disable-next-line
      orbitdb = new OrbitDB(
        ipfs,
        path.resolve(__dirname, "../../orbitdb/orbit-data"),
        orbitOptions
      );
      // eslint-disable-next-line
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

const createOrbitDIDResolver = orbitdb => ({
  resolve: async orbitDID => {
    orbitDID = orbitDID.split("#")[0];
    const address = orbitDBDIDToOrbitDBAddress(orbitDID);
    const db = await orbitdb.open(address);
    await db.load();
    const doc = await db.get(orbitDID);
    if (doc.length) {
      return doc[0];
    } else {
      console.error("unable to get did document.");
    }
  }
});

const createOrbitDIDWallet = async password => {
  const w = await createWallet();

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

const getOrbitDBFromWallet = async w => {
  const orbitKID = Object.keys(w.data.keystore)[1];
  const keypair = w.data.keystore[orbitKID].data;
  const orbitdb = await getOrbitDBFromKeypair(keypair);
  return orbitdb;
};

const createOrbitDIDFromWallet = async (w, password) => {
  const openPGPKID = Object.keys(w.data.keystore)[0];
  const orbitKID = Object.keys(w.data.keystore)[1];

  let did = await publicKeyToDID(
    "openpgp",
    w.data.keystore[openPGPKID].data.publicKey
  );

  let result = await w.toDIDDocument({
    did,
    proofSet: [
      {
        kid: constructDIDPublicKeyID(did, openPGPKID),
        password
      }
    ],
    cacheLocal: true
  });

  const orbitdb = await getOrbitDBFromWallet(w);
  const db = await orbitdb.docs(result.data.id, {
    write: [orbitdb.key.getPublic("hex")]
  });
  await db.load();
  const address = db.address.toString();
  const orbitDID = orbitdbAddressToDID(address);
  did = orbitDID;
  
  // const doesDIDDocExist = await db.get(orbitDID);

  // if (doesDIDDocExist.length) {
  //   console.log("DID Exists, returning.");
  //   return {
  //     wallet: w,
  //     did_document: doesDIDDocExist[0],
  //     password
  //   };
  // }

  // create the did document with the correct did
  result = await w.toDIDDocument({
    did: orbitDID,
    proofSet: [
      {
        kid: constructDIDPublicKeyID(did, openPGPKID),
        password
      }
    ],
    cacheLocal: true
  });

  console.log(orbitDID)


  await db.put({
    _id: result.data.id,
    ...result.data
  });

  const revocationsLog = await orbitdb.log("revocations", {
    write: [orbitdb.key.getPublic("hex")]
  });

  await revocationsLog.load();

  const revocationsLogAddress = revocationsLog.address.toString();

  w.data.keystore[openPGPKID].meta.did.revocations = revocationsLogAddress;
  w.data.keystore[orbitKID].meta.did.revocations = revocationsLogAddress;

  result = await w.toDIDDocument({
    did: orbitDID,
    proofSet: [
      {
        kid: constructDIDPublicKeyID(did, openPGPKID),
        password
      }
    ],
    cacheLocal: true
  });

  await db.put({
    _id: result.data.id,
    ...result.data
  });

  return {
    wallet: w,
    did_document: result.data,
    password
  };
};

const createOrbitClaimResolver = (
  orbitdb,
  TransmuteAdapterOrbitDB,
  SignatureStore
) => {
  const adapter = new TransmuteAdapterOrbitDB(orbitdb);
  const resolver = createOrbitDIDResolver(orbitdb);
  return {
    resolve: async claimID => {
      const [did, contentID] = claimID.split("#contentID=");
      const address = await orbitDBDIDToOrbitDBAddress(did);
      await adapter.open(address);
      await adapter.db.load();
      const signatureStore = new SignatureStore(adapter, resolver);
      const resolvedClaim = await signatureStore.getSignedLinkedDataByContentID(
        contentID
      );
      const isSignatureKeyRevoked = await isKeyRevoked(resolvedClaim);

      return {
        claim: resolvedClaim.signedLinkedData,
        isSignatureValid: resolvedClaim.verified,
        isSignatureKeyRevoked: isSignatureKeyRevoked
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
  const linkedDataSignature = await wallet.createSignedLinkedData({
    data: claim,
    proofChain: [
      {
        kid: constructDIDPublicKeyID(did, kid),
        password
      }
    ]
  });

  const orbitdb = await getOrbitDBFromWallet(wallet);

  const adapter = new TransmuteAdapterOrbitDB(orbitdb);
  const address = await orbitDBDIDToOrbitDBAddress(did);
  await adapter.open(address);
  const resolver = await createOrbitDIDResolver(orbitdb, verifyDIDSignature);
  const signatureStore = new SignatureStore(adapter, resolver);
  const { contentID } = await signatureStore.add(linkedDataSignature.data);
  const claimID = `${did}#contentID=${contentID}`;
  return {
    claimID
  };
};

const isKeyRevoked = async ({ signedLinkedData }) => {
  // eslint-disable-next-line

  const result = await verifySignedLinkedData({
    signedLinkedData,
    verifyDIDSignatureWithResolver,
    resolver: {
      resolve: did => {
        return orbitDIDRevocationsResolver(did);
      }
    }
  });
  if (!result.verified) {
    console.warn("could not verify signedLinkedData, assume keys are revoked.");
    return false;
  }

  const proofKeys = await Promise.all(
    (signedLinkedData.proof || signedLinkedData.proofChain).map(async p => {
      const doc = await orbitDIDRevocationsResolver(p.creator);
      const key = _.find(doc.publicKey, key => {
        return key.id === p.creator;
      });
      return key;
    })
  );
  const proofKeysRevoked = _.filter(proofKeys, key => {
    return key.revocation;
  });
  return proofKeysRevoked.length !== 0;
};

const orbitDIDRevocationsResolver = async did => {
  const orbitdb = await getOrbitDBFromKeypair();
  const resolver = await createOrbitDIDResolver(orbitdb);

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
      key.revocation = revocationMap[kid].hash;
    }
  });

  return doc;
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

module.exports = {
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
  isKeyRevoked,
  isLinkedDataSignedByDocument
};

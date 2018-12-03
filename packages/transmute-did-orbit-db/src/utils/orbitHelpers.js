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
  verifyDIDSignature,
  constructDIDPublicKeyID,
  transformNestedDIDToDID
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
    const doc = await db.get(orbitDID);

    if (doc.length) {
      const { object, signature, meta } = doc[0];

      // did doc signatures do not contain a did reference
      // here we hack the kid to be correct so verify will select the correct key
      // meta.kid = constructDIDPublicKeyID(object.id, meta.kid);

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

      // Create OrbitDB instance
      const orbitdb = new OrbitDB(ipfs, "./orbitdb", orbitOptions);

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

  // calculate the did before calling this...
  // need to be able to specify the did upfront here...
  let rawDocument = await w.toDIDDocument({
    // did: "temp...",
    kid: openPGPKID,
    password
  });

  const orbitdb = await getOrbitDBFromWallet(w);

  const db = await orbitdb.docs(rawDocument.object.id, {
    write: [
      // Give access to our orbit instance
      // we should use our wallet here... to avoid confusion.
      orbitdb.key.getPublic("hex")
    ]
  });
  const address = db.address.toString();
  const orbitDID = orbitdbAddressToDID(address);

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
    write: [
      // Give access to our orbit instance
      // we should use our wallet here... to avoid confusion.
      orbitdb.key.getPublic("hex")
    ]
  });

  await revocationsLog.add({ kid: openPGPKID });
  // await revocationsLog.add({ kid: orbitKID });

  const revocationsLogAddress = revocationsLog.address.toString();

  w.data.keystore[openPGPKID].meta.did.revocations = revocationsLogAddress;
  w.data.keystore[orbitKID].meta.did.revocations = revocationsLogAddress;

  let didDocWithRevocations = await w.toDIDDocument({
    did: rawDocument.object.id,
    kid: openPGPKID,
    password
  });

  let hash = await db.put({
    _id: didDocWithRevocations.object.id,
    ...didDocWithRevocations
  });

  // console.log(db.address.toString(), hash, didDocWithRevocations)

  return {
    wallet: w,
    orbitDID,
    did_document: didDocWithRevocations.object,
    password
  };
};

const TransmuteDIDWallet = wallet.TransmuteDIDWallet;

const orbitDIDResolver = async did => {
  const orbit = await getOrbitDBFromKeypair();
  const resolver = await createOrbitDIDResolver(orbit, verifyDIDSignature);
  return resolver.resolve(did.split("kid=")[0]);
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
        // transformNestedDIDToDID
      );
      const storeObject = await signatureStore.getBySignatureID(signatureID);
      return storeObject;
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
    verifyDIDSignature,
    // transformNestedDIDToDID
  );

  const storeObject = {
    object,
    signature,
    meta
  };

  const { signatureID } = await signatureStore.add(storeObject);

  console.log(signatureID)

  const claimResolver = createOrbitClaimResolver(
    orbitdb,
    TransmuteAdapterOrbitDB,
    SignatureStore,
    verifyDIDSignature
  );

  const resolvedClaim = await claimResolver.resolve(did, signatureID);

  const verifiedClaim = await signatureStore.verify(
    resolvedClaim.object,
    resolvedClaim.signature,
    resolvedClaim.meta
  );

  return {
    signatureID,
    resolvedClaim,
    verifiedClaim
  };
};

export {
  ipfsOptions,
  getOrbitDBFromKeypair,
  TransmuteDIDWallet,
  createOrbitDIDWallet,
  createOrbitDIDFromWallet,
  verifyDIDSignature,
  orbitDIDResolver,
  createOrbitDIDClaimFromWallet

  // orbitdbAddressToDID,
  // orbitDBDIDToOrbitDBAddress,
  // TransmuteAdapterOrbitDB,
  // CustomTestKeystore,
  // getOrbitDBFromKeypair,
  // createOrbitDIDResolver,
  // createOrbitClaimResolver,

  // SignatureStore,
  // createOrbitDIDRevocationChecker,
  // createOrbitDID,
};

// const createOrbitDIDRevocationChecker = (orbitdb, verifyDIDSignature) => {
//   const resolver = createOrbitDIDResolver(orbitdb, verifyDIDSignature);
//   return {
//     resolve: async orbitDID => {
//       // console.log(
//       //   "get document, iterate public keys, get revocations, normalize agaisnt public keys"
//       // );
//       const doc = await resolver.resolve(orbitDID);

//       console.log(doc);
//       const revocationsAddresses = _.uniq(
//         _.map(doc.publicKey, key => {
//           return key.revocations;
//         })
//       );
//       const getAllRevocationsFromAddress = async address => {
//         const revocationsLog = await orbitdb.open(address);
//         await revocationsLog.load();
//         const allRevocations = revocationsLog
//           .iterator({ limit: -1 })
//           .collect()
//           .map(e => {
//             console.log(e);
//             return e.payload.value;
//           });
//         return allRevocations;
//       };

//       const allRevocations = _.map(
//         _.flatten(
//           await Promise.all(
//             revocationsAddresses.map(async address => {
//               return await getAllRevocationsFromAddress(address);
//             })
//           )
//         ),
//         data => {
//           return data.kid;
//         }
//       );

//       const allRevokedPublicKeys = _.filter(
//         _.map(doc.publicKey, key => {
//           // todo: import #kid= from did lib in case it changes...
//           const kid = key.id.split("#kid=")[1];
//           return allRevocations.indexOf(kid) !== -1 ? key : undefined;
//         }),
//         key => {
//           return !!key;
//         }
//       );

//       return {
//         revokedPublicKeys: allRevokedPublicKeys
//       };
//     }
//   };
// };

// const createOrbitDID = async orbitdb => {
//   const w = await wallet.createWallet();

//   const password = "yolo";

//   let keypair = await openpgpExtensions.cryptoHelpers.generateArmoredKeypair({
//     name: "test-key",
//     passphrase: password
//   });

//   await w.addKey(keypair, "assymetric", {
//     version: `openpgp@${pack.dependencies.openpgp}`,
//     tags: ["OpenPGP.js", "macbook pro"],
//     notes: "created for testing purposes",
//     did: {
//       publicKey: true,
//       authentication: true,
//       publicKeyType: "publicKeyPem",
//       signatureType: "Secp256k1VerificationKey2018"
//     }
//   });

//   keypair = await ellipticExtensions.createKeypair();

//   await w.addKey(keypair, "assymetric", {
//     version: `elliptic@${pack.dependencies.elliptic}`,
//     tags: ["OrbitDB", "macbook pro"],
//     notes: "created for testing purposes",
//     did: {
//       publicKey: true,
//       authentication: true,
//       publicKeyType: "publicKeyHex",
//       signatureType: "Secp256k1VerificationKey2018"
//     }
//   });

//   const openPGPKID = Object.keys(w.data.keystore)[0];

//   const orbitKID = Object.keys(w.data.keystore)[1];

//   const { object, signature, meta } = await w.toDIDDocument(
//     openPGPKID,
//     password
//   );

//   // const db = await orbitdb.docs(object.id, {
//   //   write: [
//   //     // Give access to our orbit instance
//   //     // we should use our wallet here... to avoid confusion.
//   //     orbitdb.key.getPublic("hex")
//   //   ]
//   // });

//   // const address = db.address.toString();
//   // const orbitDID = orbitdbAddressToDID(address);

//   // await db.put({
//   //   _id: object.id,
//   //   object,
//   //   signature,
//   //   meta
//   // });

//   // const revocationsLog = await orbitdb.log("revocations", {
//   //   write: [
//   //     // Give access to our orbit instance
//   //     // we should use our wallet here... to avoid confusion.
//   //     orbitdb.key.getPublic("hex")
//   //   ]
//   // });

//   // await revocationsLog.add({ kid: openPGPKID });
//   // // await revocationsLog.add({ kid: orbitKID });

//   // const revocationsLogAddress = revocationsLog.address.toString();

//   // w.data.keystore[openPGPKID].meta.did.revocations = revocationsLogAddress;
//   // w.data.keystore[orbitKID].meta.did.revocations = revocationsLogAddress;

//   // let didDocWithRevocations = await w.toDIDDocument(openPGPKID, password);

//   // await db.put({
//   //   _id: didDocWithRevocations.object.id,
//   //   ...didDocWithRevocations
//   // });

//   // console.log(orbitDID);

//   // return didDocWithRevocations.object;
// };

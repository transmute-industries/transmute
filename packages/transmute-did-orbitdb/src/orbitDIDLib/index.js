const { constructDIDPublicKeyID, publicKeyKIDPrefix } = require('@transmute/transmute-did').did;

const orbitdbAddressToDID = (address) => {
  const parts = address.split('did:transmute.');
  const orbitAddress = parts[0].replace('/orbitdb/', '').replace('/', '');
  const didSignatureMethod = parts[1].split(':')[0];
  const didSignatureID = parts[1].split(':')[1];
  return `did:orbitdb.transmute.${didSignatureMethod}:${orbitAddress}.${didSignatureID}`.trim();
};

const orbitDBDIDToOrbitDBAddress = (orbitDID) => {
  // we exclude the fragment when converting a did.
  //   eslint-disable-next-line
  orbitDID = orbitDID.split('#')[0];
  const parts = orbitDID.split('.');
  const didParts = parts[2].split(':');
  const orbitAddress = didParts[1];
  return `/orbitdb/${orbitAddress}/did:transmute.${didParts[0]}:${parts[parts.length - 1]}`.trim();
};

const createOrbitDIDResolver = (orbitdb, verifyDIDSignature) => ({
  resolve: async (orbitDID) => {
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
      throw new Error('Signature verifcation failed.');
    } else {
      // console.log("doc signature verified");
    }
    return object;
  },
});

const kidTransformRegex = /(did:(.+)\.transmute\.(.+)):(.+\.)(.+)/;
const transform = (did) => {
  const result = did.match(kidTransformRegex);
  if (result) {
    const maybeKIDInDID = result[5].split('#');
    const didSignatureMethod = result[3];
    const didSignatureID = maybeKIDInDID[0];
    const kid = maybeKIDInDID[1];
    const kidPart = kid ? `#${publicKeyKIDPrefix}${kid}` : '';
    return `did:transmute.${didSignatureMethod}:${didSignatureID}${kidPart}`;
  }
  return did;
};

const createOrbitClaimResolver = (
  orbitdb,
  TransmuteAdapterOrbitDB,
  SignatureStore,
  verifyDIDSignature,
) => {
  const adapter = new TransmuteAdapterOrbitDB(orbitdb);
  const resolver = createOrbitDIDResolver(orbitdb, verifyDIDSignature);
  return {
    resolve: async (orbitDID, signatureID) => {
      const address = await orbitDBDIDToOrbitDBAddress(orbitDID);
      await adapter.open(address);
      await adapter.db.load();
      const signatureStore = new SignatureStore(adapter, resolver, verifyDIDSignature, transform);
      const storeObject = await signatureStore.getBySignatureID(signatureID);
      return storeObject;
    },
  };
};

module.exports = {
  orbitdbAddressToDID,
  orbitDBDIDToOrbitDBAddress,
  createOrbitDIDResolver,
  createOrbitClaimResolver,
  kidTransformRegex,
  transform,
};

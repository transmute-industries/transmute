const signatureAttributeNames = ['proof', 'signature'];

const publicKeyAttributeNames = ['publicKeyPem'];

const verifyLinkedDataWithDIDResolver = async ({ data, verify, resolver }) => {
  // determine the signature property in the data.
  // could be signature or proof.
  let signature;
  signatureAttributeNames.forEach((name) => {
    if (!signature) {
      signature = data[name];
    }
  });

  if (!signature) {
    throw new Error('signature or proof not present in data.');
  }

  // remove fragment from creator to obtain DID
  const did = signature.creator.split('#')[0];
  const didDocument = await resolver.resolve(did);

  // get the public key from document that matches the creator attribute
  // of the data
  let publicKey;
  didDocument.publicKey.forEach((k) => {
    if (k.id === signature.creator) {
      publicKey = k;
    }
  });

  if (!publicKey) {
    throw new Error(
      'Creator key is not present in resolved DID Document. Catch this error and consider the key revoked.',
    );
  }

  // get the public key in the format that the suite expects
  let publicKeyUsed;
  publicKeyAttributeNames.forEach((name) => {
    if (publicKey[name]) {
      publicKeyUsed = publicKey[name];
    }
  });

  // use the verify function provided
  return verify({
    data,
    publicKey: publicKeyUsed,
  });
};

module.exports = {
  verifyLinkedDataWithDIDResolver,
};

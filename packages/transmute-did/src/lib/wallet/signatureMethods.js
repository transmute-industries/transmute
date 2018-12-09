const _ = require('lodash');
const moment = require('moment');
const stringify = require('json-stringify-deterministic');

const sodiumExtensions = require('../cryptoSuites/sodiumExtensions');
const openpgpExtensions = require('../cryptoSuites/openpgpExtensions');
const ellipticExtensions = require('../cryptoSuites/ellipticExtensions');

const pack = require('../../../package.json');

const guessKeyType = (key) => {
  if (key.meta.version.indexOf('openpgp') === 0) {
    return 'openpgp';
  }
  if (key.meta.version.indexOf('libsodium-wrappers') === 0) {
    return 'libsodium-wrappers';
  }
  if (key.meta.version.indexOf('elliptic') === 0) {
    return 'elliptic';
  }

  throw new Error('unguessable key type');
};

const marshalSignedDataObject = ({
  field, object, signature, meta,
}) => {
  const objectWithoutProofMeta = _.cloneDeep(object);
  delete objectWithoutProofMeta.proofMeta;
  objectWithoutProofMeta[field] = objectWithoutProofMeta[field] || [];
  objectWithoutProofMeta[field].push({
    type: 'LinkedDataSignature2015',
    created: moment.utc().toISOString(),
    creator: meta.kid,
    proofValue: signature,
    nonce: object.proofMeta.nonce,
    domain: object.proofMeta.domain,
    meta,
  });

  return objectWithoutProofMeta;
};

const unmarshalSignedData = ({ field, signedLinkedData, proof }) => {
  let mutable = _.cloneDeep(signedLinkedData);
  mutable = {
    ...mutable,
    proofMeta: {
      nonce: proof.nonce,
      domain: proof.domain,
    },
  };
  if (field === 'proofChain') {
    const chainEnd = _.findIndex(mutable[field], p => p.nonce === proof.nonce);
    const chain = mutable[field].splice(0, chainEnd);
    mutable = {
      ...mutable,

      [field]: chain,
    };
  } else {
    delete mutable[field];
  }

  return {
    object: mutable,
    signature: proof.proofValue,
    meta: proof.meta,
  };
};

const signObjectWithKeypair = async ({
  keypair, obj, kid, password,
}) => {
  const guessedType = guessKeyType(keypair);
  const payload = stringify(obj);
  let signature;

  switch (guessedType) {
    case 'openpgp':
      signature = await openpgpExtensions.cryptoHelpers.signDetached(
        payload,
        keypair.data.privateKey,
        password,
      );
      break;

    case 'libsodium-wrappers':
      signature = await sodiumExtensions.signDetached({
        message: payload,
        privateKey: keypair.data.privateKey,
      });
      break;

    case 'elliptic':
      signature = await ellipticExtensions.sign(payload, keypair.data.privateKey);
      break;

    default:
      throw new Error('Unknown key type. Cannot sign did document');
  }

  const meta = {
    version: `${guessedType}@${pack.dependencies[guessedType]}`,
    kid,
  };

  return {
    object: obj,
    signature,
    meta,
  };
};

const signWithProofSet = async ({ data, proofSet, signObject }) => {
  const signedLinkedData = _.cloneDeep(data);
  const signedData = await Promise.all(
    proofSet.map(async ({ kid, domain, password }) => {
      const { object, signature, meta } = await signObject({
        obj: {
          ...data,
          proofMeta: {
            nonce: await sodiumExtensions.generateSalt(),
            domain: domain || 'wallet',
          },
        },
        kid,
        password,
      });
      return marshalSignedDataObject({
        field: 'proof',
        object,
        signature,
        meta,
      });
    }),
  );

  signedLinkedData.proof = signedData.map(signedObject => signedObject.proof[0]);
  return signedLinkedData;
};

const signWithProofChain = async ({ data, proofChain, signObject }) => {
  let lastSignedObject = {
    ..._.cloneDeep(data),
  };
  // eslint-disable-next-line
  for (let i = 0; i < proofChain.length; i++) {
    const signatureMaterial = proofChain[i];
    const { kid, domain, password } = signatureMaterial;
    // eslint-disable-next-line
    const obj = {
      ...lastSignedObject,
      proofMeta: {
        // eslint-disable-next-line
        nonce: await sodiumExtensions.generateSalt(),
        domain: domain || 'wallet',
      },
      proofChain: [...(lastSignedObject.proofChain || [])],
    };
    // eslint-disable-next-line
    const { object, signature, meta } = await signObject({
      obj,
      kid,
      password,
    });
    lastSignedObject = marshalSignedDataObject({
      field: 'proofChain',
      object,
      signature,
      meta,
    });
  }
  return lastSignedObject;
};

const verifySignedLinkedData = async ({
  signedLinkedData,
  verifyDIDSignatureWithResolver,
  resolver,
}) => {
  let verifications = [];
  if (signedLinkedData.proofChain) {
    // eslint-disable-next-line
    for (let i = 0; i < signedLinkedData.proofChain.length; i++) {
      const proof = signedLinkedData.proofChain[i];
      const { object, signature, meta } = unmarshalSignedData({
        field: 'proofChain',
        signedLinkedData: {
          ...signedLinkedData,
          proofMeta: { nonce: proof.nonce, domain: proof.domain },
        },
        proof,
      });
      // eslint-disable-next-line
      const verification = await verifyDIDSignatureWithResolver({
        object,
        signature,
        meta,
        resolver,
      });
      verifications.push(verification);
    }
  }

  if (signedLinkedData.proof) {
    verifications = await Promise.all(
      signedLinkedData.proof.map(async (proof) => {
        const { object, signature, meta } = unmarshalSignedData({
          field: 'proof',
          signedLinkedData,
          proof,
        });

        return verifyDIDSignatureWithResolver({
          object,
          signature,
          meta,
          resolver,
        });
      }),
    );
  }
  return _.every(verifications);
};

const createSignedLinkedData = async ({
  data, proofSet, proofChain, signObject,
}) => {
  if (proofSet && proofSet.length) {
    return signWithProofSet({
      data,
      proofSet,
      signObject,
    });
  }
  if (proofChain && proofChain.length) {
    return signWithProofChain({
      data,
      proofChain,
      signObject,
    });
  }
  throw new Error('createSignedLinkedData requires proofSet or proofChain');
};

module.exports = {
  createSignedLinkedData,
  verifySignedLinkedData,
  signObjectWithKeypair,
};

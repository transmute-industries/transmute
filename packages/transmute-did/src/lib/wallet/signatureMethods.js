const _ = require('lodash');
const moment = require('moment');

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

  const result = {
    ...objectWithoutProofMeta,
    [field]: {
      type: 'LinkedDataSignature2015',
      created: moment.utc().toISOString(),
      creator: meta.kid,
      proofValue: signature,
      nonce: object.proofMeta.nonce,
      domain: object.proofMeta.domain,
      meta,
    },
  };

  return result;
};

const unmarshalSignedData = ({ field, signedLinkedData }) => {
  const mutable = _.cloneDeep(signedLinkedData);
  const proof = mutable[field];
  delete mutable[field];

  return {
    object: {
      ...mutable,
      proofMeta: {
        nonce: proof.nonce,
        domain: proof.domain,
      },
    },
    signature: proof.proofValue,
    meta: proof.meta,
  };
};

const signObjectWithKeypair = async ({
  keypair, field, obj, kid, password,
}) => {
  const guessedType = guessKeyType(keypair);
  const payload = JSON.stringify(obj);
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

  return marshalSignedDataObject({
    field,
    object: obj,
    signature,
    meta,
  });
};
const createSignedLinkedData = async ({ data, proofSet, signObject }) => {
  const signedLinkedData = _.cloneDeep(data);
  const signedData = await Promise.all(
    proofSet.map(async ({ kid, domain, password }) => {
      console.log('kid', kid);
      return signObject({
        field: 'proof',
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
    }),
  );

  signedLinkedData.proof = signedData.map(signedObject => signedObject.proof);
  return signedLinkedData;
};

const verifySignedLinkedData = async ({
  signedLinkedData,
  verifyDIDSignatureWithResolver,
  resolver,
}) => {
  if (!signedLinkedData.proof) {
    throw new Error('SignedLinkedData does not contain a proof field!');
  }

  const verifications = await Promise.all(
    signedLinkedData.proof.map(async (proof) => {
      const { object, signature, meta } = unmarshalSignedData({
        field: 'proof',
        signedLinkedData: {
          ...signedLinkedData,
          proof,
        },
      });

      return verifyDIDSignatureWithResolver({
        object,
        signature,
        meta,
        resolver,
      });
    }),
  );

  return _.every(verifications);
};

module.exports = {
  createSignedLinkedData,
  verifySignedLinkedData,
  signObjectWithKeypair,
};

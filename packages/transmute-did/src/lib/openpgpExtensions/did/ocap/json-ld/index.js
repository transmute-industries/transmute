const base64url = require('base64url');

const cryptoHelpers = require('../../../cryptoHelpers');

const pack = require('../../../../../../package.json');

const openpgpVersion = `openpgp@${pack.dependencies.openpgp}`;

const openpgpSignJson = async (obj, didKeyId, privateKey, passphrase) => {
  const stringifiedObj = JSON.stringify(obj);
  const signedStringifiedObj = await cryptoHelpers.sign({
    message: stringifiedObj,
    privateKey,
    passphrase,
  });
  const encodedSignedStringifiedObj = base64url(signedStringifiedObj);
  const signatureObj = {
    type: openpgpVersion,
    created: new Date().toISOString(),
    creator: didKeyId,
    signatureValue: encodedSignedStringifiedObj,
  };

  return {
    ...obj,
    signature: signatureObj,
  };
};

const openpgpVerifyJson = async (obj, publicKey) => {
  const { signature } = obj;
  const objWithoutSig = JSON.parse(JSON.stringify(obj));
  delete objWithoutSig.signature;
  const message = base64url.decode(signature.signatureValue);

  if (!((await cryptoHelpers.getMessagePayload(message)) === JSON.stringify(objWithoutSig))) {
    throw new Error('Object signature does not match object');
  }

  return cryptoHelpers.verify({
    message,
    publicKey,
  });
};

module.exports = {
  openpgpSignJson,
  openpgpVerifyJson,
};

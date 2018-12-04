const openpgp = require('openpgp');

const base64url = require('base64url');

const cryptoHelpers = require('../../../cryptoHelpers');

const { armoredKeytoDID } = require('../../../did');

const openpgpCreateSignedJWT = async ({ sub, aud, claims }, { did, privateKey, passphrase }) => {
  const privKeyObj = (await openpgp.key.readArmored(privateKey)).keys[0];
  await privKeyObj.decrypt(passphrase);

  const header = {
    alg: 'openpgp.js',
    typ: 'JWT',
  };

  const payload = {
    iss: did,
    sub,
    aud,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 2 * 60 * 60,
    claims,
  };

  const signedMessage = await cryptoHelpers.sign({
    message: JSON.stringify(payload),
    privateKey,
    passphrase,
  });

  return `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}.${base64url(
    signedMessage,
  )}`;
};

const openpgpVerifySignedJWT = async (jwt, { issDID, issPublicKey }) => {
  let [header, payload, signature] = jwt.split('.').map(tag => base64url.decode(tag));

  header = JSON.parse(header);
  payload = JSON.parse(payload);

  // this step can be removed once a did resolver is used.
  if ((await armoredKeytoDID(issPublicKey)) !== issDID) {
    throw new Error('issDID is not the same as issPublicKey');
  }

  if (payload.iss !== issDID) {
    throw new Error('Invalid DID Issuer.');
  }

  if (
    !(await cryptoHelpers.verify({
      message: signature,
      publicKey: issPublicKey,
    }))
  ) {
    throw new Error('JWT was not signed by issDID');
  }

  return {
    header,
    payload,
    signature,
  };
};

module.exports = {
  openpgpCreateSignedJWT,
  openpgpVerifySignedJWT,
};

const crypto = require('crypto');

const path = require('path');

const callbackServer = require('./callbackServer');

const config = require('./config');

const fse = require('fs-extra');

const writeFile = async (filePath, fileData) => {
  return new Promise((resolve, reject) => {
    fse.outputFile(filePath, fileData, err => {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
};

function base64URLEncode(str) {
  return str
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function sha256(buffer) {
  return crypto
    .createHash('sha256')
    .update(buffer)
    .digest();
}

export const login = async () => {
  const { okta_host, redirect_uri, client_id } = config;

  var code_verifier = base64URLEncode(crypto.randomBytes(32));
  var code_challenge = base64URLEncode(sha256(code_verifier));

  const url = `https://${okta_host}/oauth2/default/v1/authorize?client_id=${client_id}&response_type=code&scope=openid&redirect_uri=${redirect_uri}&state=state-8600b31f-52d1-4dca-987c-386e3d8967e9&code_challenge_method=S256&code_challenge=${code_challenge}`;

  console.log('open this url: \n');
  console.log(url);
  console.log();

  const response = await callbackServer(code_verifier);

  let home = require('os').homedir();

  await writeFile(
    path.join(home, '.transmute/cli-secrets/session.json'),
    JSON.stringify(response, null, 2)
  );

  return response;
};

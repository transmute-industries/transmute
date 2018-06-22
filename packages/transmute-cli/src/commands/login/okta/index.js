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

/**
 * This session object is returned from the okta authentication process.
 * @name okta_session_object
 * @param {Object} session - returned from the okta auth process.
 * @param {string} session.access_token - A signed but not encrypted JWT 
 * @param {string} session.token_type - Usually 'Bearer'
 * @param {string} session.expires_in - Expiration in seconds
 * @param {string} session.scope - Usually 'openid'
 * @param {string} session.id_token - A signed but not encrypted JWT
 */

/**
 * login with okta
 * @description This method crafts an authentication url, and then starts an http server to listen for the redirect from the authentication.
 * @return {okta_session_object} A session object with access_token and id_token.
 */
module.exports.login = async () => {
  const { okta_host, redirect_uri, client_id } = config;

  var code_verifier = base64URLEncode(crypto.randomBytes(32));
  var code_challenge = base64URLEncode(sha256(code_verifier));

  const url = `https://${okta_host}/oauth2/default/v1/authorize?client_id=${client_id}&response_type=code&scope=openid&redirect_uri=${redirect_uri}&state=state-8600b31f-52d1-4dca-987c-386e3d8967e9&code_challenge_method=S256&code_challenge=${code_challenge}`;

  console.info('open this url: \n');
  console.info(url);
  console.info();

  const response = await callbackServer(code_verifier);

  let home = require('os').homedir();

  let sessionPath = path.join(home, '.transmute/cli-secrets/session.json');
  await writeFile(sessionPath, JSON.stringify(response, null, 2));

  console.info('session saved: ', sessionPath);

  return response;
};

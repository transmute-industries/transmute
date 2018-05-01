const crypto = require('crypto');

const shell = require('shelljs');

const callbackServer = require('./callbackServer');

const config = require('./config');

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

module.exports = async () => {
  const { okta_host, redirect_uri, client_id } = config;

  var code_verifier = base64URLEncode(crypto.randomBytes(32));
  var code_challenge = base64URLEncode(sha256(code_verifier));

  const url = `https://${okta_host}/oauth2/default/v1/authorize?client_id=${client_id}&response_type=code&scope=openid&redirect_uri=${redirect_uri}&state=state-8600b31f-52d1-4dca-987c-386e3d8967e9&code_challenge_method=S256&code_challenge=${code_challenge}`;
  const command = `open "${url}"`;
  const execution = shell.exec(command);
  if (execution.code !== 0) {
    shell.exit(1);
  }
  return callbackServer(code_verifier);
};

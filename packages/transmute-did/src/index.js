const sodiumExtensions = require('./lib/sodiumExtensions');
const openpgpExtensions = require('./lib/openpgpExtensions');
const shamirExtensions = require('./lib/shamirExtensions');
const ellipticExtensions = require('./lib/ellipticExtensions');
const ethereumExtensions = require('./lib/ethereumExtensions');
const wallet = require('./lib/wallet');
const misc = require('./lib/misc');
const did = require('./lib/did');

module.exports = {
  ellipticExtensions,
  sodiumExtensions,
  openpgpExtensions,
  shamirExtensions,
  ethereumExtensions,
  wallet,
  misc,
  did,
};

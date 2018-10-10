const { registerMethod } = require('did-resolver');
const dli = require('./tst-decentralized-ledger-interface.js');

// This function communicates with the decentralized ledger
// where Transmute DID documents are stored, and fetches the
// DID document corresponding to the TST DID
const resolve = did => dli.read(did);

// This function registers the resolver in the universal did-resolver
// from: https://github.com/uport-project/did-resolver
const register = () => {
  registerMethod('tst', resolve);
};

module.exports = {
  resolve,
  register,
};

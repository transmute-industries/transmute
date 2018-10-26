const Web3 = require('web3');

// Workaround for incompatibility between truffle-contract and web3 1.0
// See https://github.com/trufflesuite/truffle-contract/issues/57
Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;

module.exports = Web3;

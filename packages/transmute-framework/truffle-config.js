require('dotenv').config();
const Web3 = require('web3');
var HDWalletProvider = require("truffle-hdwallet-provider");
const transmuteConfig = require('./src/transmute-config');

module.exports = {
  migrations_directory: './migrations',
  networks: {
    development: {
      provider: new Web3.providers.HttpProvider(transmuteConfig.web3Config.providerUrl),
      network_id: '*' // Match any network id
    },
    ropsten: {
      provider: new HDWalletProvider(process.env.ROPSTEN_MNEMONIC, 'https://ropsten.infura.io/'),
      network_id: 3
    }
  }
};

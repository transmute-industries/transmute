const Web3 = require('web3');
const transmuteConfig = require('../../transmute-config');

module.exports = {
  migrations_directory: './migrations',
  networks: {
    development: {
      provider: new Web3.providers.HttpProvider(
        transmuteConfig.web3Config.providerUrl
      ),
      network_id: '*' // Match any network id
    },
    minikube: {
      provider: new Web3.providers.HttpProvider(
        transmuteConfig.web3Config.providerUrl
      ),
      network_id: '*',
      gas: 4600000
    }
  }
};

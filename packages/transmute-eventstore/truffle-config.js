const Web3 = require('web3');

const transmuteConfig = require('../../transmute-config');

const TRANSMUTE_ENV = process.env.TRANSMUTE_ENV;

module.exports = {
  migrations_directory: './migrations',
  networks: {
    development: {
      host: transmuteConfig.env[TRANSMUTE_ENV].web3Config.host,
      port: transmuteConfig.env[TRANSMUTE_ENV].web3Config.port,
      network_id: '*' // Match any network id
    },
    minikube: {
      provider: new Web3.providers.HttpProvider(
        transmuteConfig.env[TRANSMUTE_ENV].web3Config.providerUrl
      ),
      network_id: '*',
      gas: 4600000
    }
  }
};

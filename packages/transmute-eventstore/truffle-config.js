

const transmuteConfig = require('../../transmute-config')

module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: transmuteConfig.env[TRANSMUTE_ENV].web3Config.host,
      port: transmuteConfig.env[TRANSMUTE_ENV].web3Config.port,
      network_id: "*" // Match any network id
    },
    minikube: {
      host: transmuteConfig.env[TRANSMUTE_ENV].web3Config.host,
      port: transmuteConfig.env[TRANSMUTE_ENV].web3Config.port,
      network_id: "*" // Match any network id
    }
  }
};

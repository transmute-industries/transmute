

const transmuteConfig = require('../../transmute-config')

const TRANSMUTE_ENV = process.env.TRANSMUTE_ENV;

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

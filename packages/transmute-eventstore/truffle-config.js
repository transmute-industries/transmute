

const transmuteConfig = require('../../transmute-config')

module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: transmuteConfig.env.localhost.web3Config.host,
      port: transmuteConfig.env.localhost.web3Config.port,
      network_id: "*" // Match any network id
    },
    minikube: {
      host: transmuteConfig.env.minikube.web3Config.host,
      port: transmuteConfig.env.minikube.web3Config.port,
      network_id: "*" // Match any network id
    }
  }
};

const LightWalletProvider = require('@digix/truffle-lightwallet-provider')
const Web3 = require('web3');


process.env.NODE_TLS_REJECT_UNAUTHORIZED=0

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: "*",
      gas: 4600000
    },
    ganache: {
      provider: new Web3.providers.HttpProvider('https://ganache.transmute.minikube:32443'),
      network_id: "*",
      gas: 4600000
    },
    "ropsten": {
      provider: new LightWalletProvider({
        keystore: './ti-ropsten-wallet.json',
        password: process.env.PASSWORD,
        rpcUrl: 'https://ropsten.infura.io',
        debug: true, // optional, show JSON-RPC logs
        // prefund: 1e18, // optional, fund all lightwallet addresses (via coinbase) with this of wei
        pollingInterval: 2000, // optional, polling interval for the provider (reduce for faster deploy with testRPC or kovan)
      }),
      gas: 4600000,
      solc: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      },
      network_id: '*',
    },
    // "parity": {
    //   network_id: "*",
    //   host: "localhost",
    //   port: 8545
    // },
  }
};

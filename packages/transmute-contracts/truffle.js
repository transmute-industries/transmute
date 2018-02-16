const LightWalletProvider = require('@digix/truffle-lightwallet-provider')

const TESTRPC_HOST_PROVIDER = process.env.GANACHE_CLI || 'http://testrpc.transmute.network:8545';
const HOST = TESTRPC_HOST_PROVIDER.split('//')[1].split(':')[0]
const PORT = TESTRPC_HOST_PROVIDER.split(":")[2]

module.exports = {
  networks: {
    development: {
      host: HOST,
      port: PORT,
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

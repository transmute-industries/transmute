const Web3 = require("web3");
const ProviderEngine = require("web3-provider-engine");
const RpcSubprovider = require("web3-provider-engine/subproviders/rpc");
const WalletSubprovider = require("web3-provider-engine/subproviders/wallet");

const RPC_HOST = "http://localhost:8545";

const engine = new ProviderEngine();

engine.addProvider(
  new RpcSubprovider({
    rpcUrl: RPC_HOST
  })
);

engine.start();

module.exports = new Web3(engine);

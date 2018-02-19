const Web3 = require('web3');
const ProviderEngine = require('web3-provider-engine');
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc');

const RPC_HOST = 'https://ropsten.infura.io';

const engine = new ProviderEngine();

engine.addProvider(
  new RpcSubprovider({
    rpcUrl: RPC_HOST
  })
);

engine.start();

export default new Web3(engine);

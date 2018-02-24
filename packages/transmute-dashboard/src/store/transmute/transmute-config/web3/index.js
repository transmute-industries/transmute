const Web3 = require('web3');
const ProviderEngine = require('web3-provider-engine');
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc');

const web3Config = {
  providerUrl: 'http://localhost:8545'
};

export const getWeb3 = async () => {
  let web3js;
  return new Promise(async (resolve, reject) => {
    if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
      web3js = new Web3(window.web3.currentProvider);
    } else {
      console.log(
        `MetaMask not available, defaulting to ${web3Config.providerUrl}\n`
      );

      // const WalletSubprovider = require("web3-provider-engine/subproviders/wallet");

      const engine = new ProviderEngine();

      engine.addProvider(
        new RpcSubprovider({
          rpcUrl: web3Config.providerUrl
        })
      );

      engine.start();

      web3js = new Web3(engine);
    }
    try {
      await web3js.eth.getAccounts();
      resolve(web3js);
    } catch (e) {
      reject(e);
    }
  });
};


export default {
  getWeb3
}
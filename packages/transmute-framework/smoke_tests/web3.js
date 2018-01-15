// const T = require("../dist/transmute-framework.umd");
const Web3 = require("web3");
const ProviderEngine = require("web3-provider-engine");
const RpcSubprovider = require("web3-provider-engine/subproviders/rpc.js");
const WalletSubprovider = require("web3-provider-engine/subproviders/wallet.js");

const RPC_HOST = "http://localhost:8545";

const getAccounts = _web3 => {
  return new Promise((resolve, reject) => {
    _web3.eth.getAccounts((err, accounts) => {
      console.log(err, accounts);
      if (err) {
        reject(err);
      }
      resolve(accounts);
    });
  });
};

const sleep = seconds => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, seconds * 1000);
  });
};

(async () => {
  // console.log("getting vanilla accounts...");
  // let web3 = new Web3(new Web3.providers.HttpProvider(RPC_HOST));

  const engine = new ProviderEngine();
  engine.addProvider(
    new RpcSubprovider({
      rpcUrl: RPC_HOST
    })
  );
  engine.start();
  web3 = new Web3(engine);

  // console.log("getting provider engine accounts...");

  // console.log(providerEngineAccounts);

  // console.log("getting relic accounts...");
  // let relic = new T.Relic();
  // let relicAccounts = await getAccounts(relic.web3);
  // console.log(relicAccounts);

  let accounts = await getAccounts(web3);
  console.log(accounts);
  // console.log("SUCCESS");
})();

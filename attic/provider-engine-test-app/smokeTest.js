const Web3 = require("web3");
const ProviderEngine = require("web3-provider-engine");
const RpcSubprovider = require("web3-provider-engine/subproviders/rpc");
const WalletSubprovider = require("web3-provider-engine/subproviders/wallet");

const T = require('transmute-framework');

const RPC_HOST = "http://localhost:8545";
const engine = new ProviderEngine();

engine.addProvider(
  new RpcSubprovider({
    rpcUrl: RPC_HOST
  })
);

engine.start();

const testGetAccounts = someWeb3 => {
  return new Promise((resolve, reject) => {
    someWeb3.eth.getAccounts((err, accounts) => {
      if (err) {
        reject(err);
      }
      resolve(accounts);
    });
  });
};

(async () => {
  let web3, accounts;
  console.log('Begin node smoke tests...')
  web3 = new Web3(new Web3.providers.HttpProvider(RPC_HOST));
  accounts = await testGetAccounts(web3);
  console.log(accounts.length === 10, "can use vanilla web3 in node");

  web3 = new Web3(engine);
  accounts = await testGetAccounts(web3);
  console.log(accounts.length === 10, "can use provider engine in node");

  let relic = new T.Relic(web3);
  accounts = await relic.getAccounts();
  console.log(accounts.length === 10, "can use relic in node");

  console.log('Smoke tests complete...')
  process.exit(0);
})();

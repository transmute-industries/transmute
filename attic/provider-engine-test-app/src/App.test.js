const Web3 = require("web3");
const ProviderEngine = require("web3-provider-engine");
const RpcSubprovider = require("web3-provider-engine/subproviders/rpc");
const WalletSubprovider = require("web3-provider-engine/subproviders/wallet");

const RPC_HOST = "http://localhost:8545";

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


it("supports vanilla web3", async () => {
  const web3 = new Web3(new Web3.providers.HttpProvider(RPC_HOST));
  const accounts = await testGetAccounts(web3);
  expect(accounts.length).toBe(10);
});

it("supports web3-provider-engine", async () => {
  const engine = new ProviderEngine();
  engine.addProvider(
    new RpcSubprovider({
      rpcUrl: RPC_HOST
    })
  );
  engine.start();
  const web3 = new Web3(engine);
  const accounts = await testGetAccounts(web3);
  expect(accounts.length).toBe(10);
});

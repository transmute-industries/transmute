// These imports are required.
const Web3 = require("web3");
const ProviderEngine = require("web3-provider-engine");
const RpcSubprovider = require("web3-provider-engine/subproviders/rpc");


const T = require("../");

const { init } = require("../transmute");

(async () => {
  const setup = await init();
  const { relic, accounts, eventStoreAdapter, readModelAdapter } = setup;
  const factory = await T.Factory.create(relic.web3, accounts[0]);
  const factoryReadModel = await T.Factory.getReadModel(
    factory,
    eventStoreAdapter,
    readModelAdapter,
    relic.web3,
    accounts[0]
  );
  // console.log(factoryReadModel);

  let store = await T.Factory.createStore(factory, accounts, relic.web3, accounts[0]);
  let ps = new T.PackageService(relic, store, eventStoreAdapter);
  let psReadModel = await ps.getReadModel(readModelAdapter);
  console.log(psReadModel);


  process.exit(0);
})();

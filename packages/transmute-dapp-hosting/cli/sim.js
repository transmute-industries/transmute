const { init } = require("../transmute");

(async () => {
  const { T, relic, accounts, eventStoreAdapter, readModelAdapter } = await init();
  // console.log(accounts);

  let factory = await T.Factory.create(relic.web3, accounts[0]);
  let store = await T.Factory.createStore(
    factory,
    accounts,
    eventStoreAdapter,
    relic.web3,
    accounts[0]
  );

  process.exit(0);
})();

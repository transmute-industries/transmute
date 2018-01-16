const web3 = require("./web3");
const eventStoreAdapter = require("./eventStoreAdapter");
const readModelAdapter = require("./readModelAdapter");

const T = require("transmute-framework");

const init = async () => {
  const relic = new T.Relic(web3);
  const accounts = await relic.getAccounts();

  //   let factory = await T.Factory.create(relic.web3, accounts[0]);

  //   let factorReadModel = await T.Factory.getReadModel(
  //     factory,
  //     eventStoreAdapter,
  //     readModelAdapter,
  //     relic.web3,
  //     accounts[0]
  //   );

  //   let eventStore = await T.Factory.createStore(
  //     factory,
  //     accounts,
  //     eventStoreAdapter,
  //     relic.web3,
  //     accounts[0]
  //   );

  return {
    T,
    relic,
    accounts,
    // factory,
    // eventStore,
    eventStoreAdapter,
    readModelAdapter
  };
};

module.exports = {
  init
};

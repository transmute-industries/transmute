import * as Constants from "./constants";
import {
  relic,
  eventStoreAdapter,
  readModelAdapter,
  factoryReadModelJSON
} from "./init";

let T = require("transmute-framework");

export const init = async () => {
  T.W3.Default = relic.web3;
  let accounts = await relic.getAccounts();

  let factoryAddress = factoryReadModelJSON.contractAddress;
  let factory = await T.EventStoreFactory.At(factoryAddress);
  // create a brand new factory
  // let factory = await T.Factory.create(relic.web3, accounts[0]);
  let factoryReadModel = await T.Factory.getReadModel(
    factory,
    eventStoreAdapter,
    readModelAdapter,
    relic.web3,
    accounts[0]
  );

  // creating a new store here, will show changes
  // let eventStore = await T.Factory.createStore(
  //   factory,
  //   accounts,
  //   relic.web3,
  //   accounts[0]
  // );
  // console.log(eventStore);

  // See the updated factory readModel
  let changes = await factoryReadModel.sync(
    factory,
    eventStoreAdapter,
    relic.web3
  );
  console.log("factory changes detected! ", changes);
  return {
    type: Constants.TRANSMUTE_INIT,
    payload: {
      factoryReadModelJSON,
      factoryReadModelRebuiltInBrowser: factoryReadModel.state,
      accounts
    }
  };
};

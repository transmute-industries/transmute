const T = require("transmute-framework");
const _ = require("lodash");

const getContractUtilization = async (
  relic,
  eventStoreAdapter,
  readModelAdapter,
  factory
) => {
  let stores = await T.Factory.getEventStores(factory, await factory.owner());
  let contractUtilization = {};
  let storeContracts = await Promise.all(
    // for each store in a factory, get its owner and make a map of
    // ownerAddress => contractAddresses
    stores.map(async storeAddress => {
      let storeContract = await T.EventStore.At(storeAddress);
      let storeOwner = await storeContract.owner();
      contractUtilization[storeOwner] = contractUtilization[storeOwner] || {};
      if (!contractUtilization[storeOwner][storeAddress]) {
        let ps = new T.PackageService(relic, storeContract, eventStoreAdapter);
        let readModel = await ps.getReadModel(readModelAdapter);
        contractUtilization[storeOwner][storeAddress] = readModel.state;
      }
      return storeContract;
    })
  );
  return contractUtilization;
};

module.exports = {
  getContractUtilization
};

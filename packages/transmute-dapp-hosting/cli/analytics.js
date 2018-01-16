const T = require("transmute-framework");
const _ = require("lodash");

const getContractUtilization = async factory => {
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
        contractUtilization[storeOwner][storeAddress] = {
          address: storeAddress,
          owner: storeOwner,
          storage: null,
          eventCount: (await storeContract.eventCount()).toNumber()
        };
      }
      return storeContract;
    })
  );
  return contractUtilization;
};

const getStorageUtilization = async (
  relic,
  eventStoreAdapter,
  contractUtilization
) => {
  //   _(contractUtilization).each(customerContractUtilization => {
  //     // console.log("customerContractUtilization: ", customerContractUtilization);

  //     _(customerContractUtilization).each( async contractUtilization => {
  //     //   console.log("contractUtilization: ", contractUtilization);
  //

  //       console.log('yolo')
  //     });
  //   });
  let customerAddresses = Object.keys(contractUtilization);

  for (let i = 0; i < customerAddresses.length; i++) {
    let customerAddress = customerAddresses[i];
    //   console.log("customer address: ", customerAddress);
    let customerContracts = contractUtilization[customerAddress];
    let customerContractAddresses = Object.keys(customerContracts);

    for (let j = 0; j < customerContractAddresses.length; j++) {
      let customerContractAddress = customerContractAddresses[j];
      let cutomerContract = customerContracts[customerContractAddress];
      
      console.log("cutomerContract: ", cutomerContract);
      let store = await T.EventStore.At(cutomerContract.address);
      let events = await T.Store.readFSAs(
        store,
        eventStoreAdapter,
        relic.web3,
        cutomerContract.owner
      );
      console.log(events)
    }
  }

  //   return contractUtilization;
};

module.exports = {
  getContractUtilization,
  getStorageUtilization
};

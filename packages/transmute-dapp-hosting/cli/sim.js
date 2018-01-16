const { init } = require("../transmute");

let subscriptionsTypes = {
  T1: {
    subscription: "T1",
    contractLimit: 3,
    storageLimit: 1 // KB, MB, GB
  }
};

let customerSubscriptions = {};

let { getContractUtilization, getStorageUtilization} = require("./analytics");

(async () => {
  try {
    console.log("\n");
    const {
      T,
      relic,
      accounts,
      eventStoreAdapter,
      readModelAdapter,
      generateTestWallets
    } = await init();

    let wallets = await generateTestWallets(3);
    console.log("# Customers already have addresses:\n");
    console.log("Alice:\t" + wallets[0].address);
    console.log("Bob:\t" + wallets[1].address);
    console.log("Eve:\t" + wallets[2].address);
    console.log("\n");

    console.log("# Customers already have subscriptions:\n");
    customerSubscriptions[wallets[0].address] = subscriptionsTypes.T1;
    console.log(JSON.stringify(customerSubscriptions, null, 2), "\n");

    console.log("# System uses factory to create a store for the customer:\n");
    let factory = await T.Factory.create(relic.web3, accounts[0]);
    let store = await T.Factory.createStore(
      factory,
      accounts,
      eventStoreAdapter,
      relic.web3,
      accounts[0]
    );
    console.log("\n");

    console.log("# System transfers ownership of store to customer:\n");
    let receipt = await store.transferOwnership(
      wallets[0].address,
      T.W3.TC.txParamsDefaultDeploy(accounts[0])
    );
    let events = T.EventTransformer.getFSAsFromReceipt(receipt);
    console.log(JSON.stringify(events, null, 2), "\n");

    console.log("# Customer contract utilization is:\n");
    let contractUtilization = await getContractUtilization(factory);
    console.log("\n", JSON.stringify(contractUtilization, null, 2), "\n");

    console.log("# Customer storage utilization is knowable.");
    let storageUtilization = await getStorageUtilization(relic, eventStoreAdapter, contractUtilization);
    console.log("\n", JSON.stringify(storageUtilization, null, 2), "\n");
    // console.log("FALSE", "\n");

    console.log("# Customer utilization increases as packages are published.");
    console.log("FALSE", "\n");

    console.log("# Customer can delete packages to reduce utilization.");
    console.log("FALSE", "\n");

    console.log("# Customer can transfer contract ownership.");
    console.log("FALSE", "\n");

    console.log("# Customer is warned when publishing exceeds utilization.");
    console.log("FALSE", "\n");

    //
  } catch (e) {
    console.log("Error: ", e);
  }
  process.exit(0);
})();

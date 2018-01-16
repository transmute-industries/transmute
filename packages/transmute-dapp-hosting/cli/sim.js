const { init } = require("../transmute");

let subscriptionsTypes = {
  T1: {
    subscription: "T1",
    contractLimit: 3,
    storageLimit: 1 // KB, MB, GB
  }
};

let customerSubscriptions = {};

let { getContractUtilization, getStorageUtilization } = require("./analytics");

(async () => {
  try {
    // console.log("\n");
    const {
      T,
      relic,
      accounts,
      eventStoreAdapter,
      readModelAdapter,
      generateTestWallets,
      getRelicWalletWithPrivateKey
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
      relic.web3,
      accounts[0]
    );
    console.log("\n");

    console.log("# System transfers ownership of store to customer:\n");
    let receipt = await store.transferOwnership(
      accounts[1],
      T.W3.TC.txParamsDefaultDeploy(accounts[0])
    );
    let events = T.EventTransformer.getFSAsFromReceipt(receipt);
    console.log(JSON.stringify(events, null, 2), "\n");

    console.log("# Customer contract & storage utilization is knowable:\n");
    let contractUtilization = await getContractUtilization(
      relic,
      eventStoreAdapter,
      readModelAdapter,
      factory
    );
    console.log("\n", JSON.stringify(contractUtilization, null, 2), "\n");

    console.log(
      "# Customer utilization increases as packages are published.\n"
    );
    let ps = new T.PackageService(relic, store, eventStoreAdapter);
    await ps.publishPackage(
      "QmNrEidQrAbxx3FzxNt9E6qjEDZrtvzxUVh47BXm55Zuen",
      "bobo@0.0.1",
      accounts[0]
    );
    let readModel = await ps.getReadModel(readModelAdapter);
    console.log(JSON.stringify(readModel.state, null, 2), "\n");

    await ps.publishPackage(
      "QmQh3iDyetVbjuyyXBNdrVo6ePtNGyjDU65QEXxSewfXaK",
      "bobo@0.0.2",
      accounts[0]
    );

    readModel = await ps.getReadModel(readModelAdapter);
    console.log(JSON.stringify(readModel.state, null, 2), "\n");

    console.log("# Customer can delete packages to reduce utilization.\n");
    await ps.deletePackage(
      "QmNrEidQrAbxx3FzxNt9E6qjEDZrtvzxUVh47BXm55Zuen",
      accounts[0]
    );
    readModel = await ps.getReadModel(readModelAdapter);
    console.log(JSON.stringify(readModel.state, null, 2), "\n");

    console.log("# Customer can transfer contract ownership.\n");
    // let relic2 = await getRelicWalletWithPrivateKey(wallets[0].privateKey.replace('0x', ''))
    // store.Default = relic2.web3;
    // T.W3.Default = relic2.web3;
    events = await T.Store.transferOwnership(
      store,
      accounts[1],
      accounts[2]
    );
    readModel = await ps.getReadModel(readModelAdapter);
    console.log(JSON.stringify(readModel.state, null, 2), "\n");

    // console.log("# Customer is warned when publishing exceeds utilization.");
    // console.log("FALSE", "\n");
  } catch (e) {
    console.log("Error: ", e);
  }
  process.exit(0);
})();

const path = require("path");
const fse = require("fs-extra");
const fs = require("fs");
const shell = require("shelljs");
const T = require("transmute-framework");
const TransmuteCrypto = require("transmute-crypto");
const transmute = require("../transmute");

const Web3 = require('web3')

const generateTestWallets = async num => {
  const sodium = await TransmuteCrypto.getSodium();
  let testWallets = [];
  for (let i = 0; i < num; i++) {
    const alice = sodium.crypto_box_keypair();
    const unPrefixedPrivateKeyHexString = sodium.to_hex(alice.privateKey);
    let address = T.Utils.privateKeyHexToAddress(
      "0x" + unPrefixedPrivateKeyHexString
    );
    testWallets.push({
      address: "0x" + sodium.to_hex(address),
      privateKey: "0x" + unPrefixedPrivateKeyHexString
    });
  }
  return testWallets;
};

const test = async () => {
  console.log("\n" + "Simulating...\n");

  // let subscriptions = {
  //   T1: {
  //     PACKAGE_LIMIT: 3,
  //     SPACE_LIMIT: 1 // KB, MB, GB
  //   }
  // };

  // let activeSubscriptions = {};

  // // - System generates Customer wallets for test.
  // let wallets = await generateTestWallets(3);
  // console.info("Customers already have accounts.");
  // console.log("Alice:\t" + wallets[0].address);
  // console.log("Bob:\t" + wallets[1].address);
  // console.log("Eve:\t" + wallets[2].address);
  // console.log("\n");

  // // - User purchases a subscription with Stripe.
  // console.info("Alice has T1 Subscription.");
  // activeSubscriptions[wallets[0].address] = subscriptions.T1;
  // console.log(activeSubscriptions);

  // - System uses factory to create a store for the customer

  // let relic = new T.Relic({
  //   providerUrl: "http://localhost:8545"
  // });

  const web3 = new Web3(new Web3.providers.HttpProvider(RPC_HOST));

  let getAccounts = () => {
    return new Promise((resolve, reject) => {
      web3.eth.getAccounts((err, accounts) => {
        if (err) {
          console.log(err)
          reject(err);
        }
        a;
        resolve(accounts);
      });
    });
  };

  // console.log(await getAccounts())

  // T.W3.Default = relic.web3;
  // let accounts = await relic.getAccounts();
  // let {
  //   relic,
  //   accounts
  //   // eventStoreAdapter,
  //   // readModelAdapter
  // } = await transmute();


  // let factory = await T.Factory.create(relic.web3, accounts[0]);
  // let factorReadModel = await T.Factory.getReadModel(
  //   factory,
  //   eventStoreAdapter,
  //   readModelAdapter,
  //   relic.web3,
  //   accounts[0]
  // );
  // let eventStore = await T.Factory.createStore(
  //   factory,
  //   accounts,
  //   eventStoreAdapter,
  //   relic.web3,
  //   accounts[0]
  // );
  // let storeOwner = await eventStore.owner()

  console.info("Alice has EventStore");

  // - System monitors packages deployed and utilization.
  // - User can issue delete packages to clean up space.

  console.log("\n");
};

return test();

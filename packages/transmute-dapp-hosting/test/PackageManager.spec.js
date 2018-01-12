const PackageManager = artifacts.require("./PackageManager.sol");
const T = require("transmute-framework");

const transmute = require("../transmute");

contract("PackageManager", async accounts => {
  let TT;
  let deployedPackageManager;
  let eventStore;

  before(async () => {
    TT = await transmute();
    deployedPackageManager = await PackageManager.deployed();
  });

  after(async () => {
    // sometimes truffle test hangs... likely due to rpc activity...
    // process.exit(0);
  });

  it("is EventStore", async () => {
    eventStore = await T.EventStore.At(deployedPackageManager.address);
    let events = await T.Store.readFSAs(
      eventStore,
      TT.eventStoreAdapter,
      TT.relic.web3,
      accounts[0]
    );
    // console.log(events)
    assert(events[0].type === "NEW_OWNER");
  });

  it("can upload new package.", async () => {
    // let event = await T.Store.writeFSA(eventStore, TT.eventStoreAdapter, TT.relic.web3, accounts[0], {
    //   type: 'PACKAGE_PUBLISHED',
    //   payload: {
    //     name: 'foo',
    //     version: '0.0.1',
    //     hash: ''
    //   },
    //   meta: {
    //     adapter: 'I'
    //   }
    // })
    // console.log(event)
  });

  
});

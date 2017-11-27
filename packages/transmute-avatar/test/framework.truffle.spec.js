var PackageManagerFactory = artifacts.require(
  "./PackageManagerFactory.sol"
);
var PackageManager = artifacts.require("./PackageManager.sol");

const chai = require("chai");
const expect = chai.expect;
const TransmuteFramework = require("transmute-framework").default;

contract("works with framework", accounts => {
  let factory;
  let oracle;
  before(async () => {
    T = TransmuteFramework.init({
      providerUrl: "http://localhost:8545",
      ipfsConfig: {
        host: "localhost",
        port: "5001",
        options: {
          protocol: "http"
        }
      },
      TRANSMUTE_API_ROOT: "http://localhost:3001"
    });

    factory = await PackageManagerFactory.deployed();
  });

  after(async () => {
    // sometimes truffle test hangs... likely due to rpc activity...
    // process.exit(0);
  })

  it("PackageManagerFactory is deployed", async () => {
    expect(factory.address).to.be.a("string");
  });

  it("PackageManagerFactory can create an PackageManager", async () => {
    let { events, tx } = await T.Factory.createEventStore(factory, accounts[0]);
    let PackageManagerAddress = events[0].payload.address;
  });

  it("PackageManagerFactory can use transmute framework to get events from the factory...", async () => {
    let event = await T.EventStore.readFSA(factory, accounts[0], 0);
    expect(event.meta.txOrigin).to.equal(accounts[0]);
  });

  it("PackageManager can use transmute framework to get events from the package manager...", async () => {
    let factoryESCreatedEvent = await T.EventStore.readFSA(
      factory,
      accounts[0],
      0
    );
    oracle = await PackageManager.at(
      factoryESCreatedEvent.payload.address
    );
    let savedEvent = await T.EventStore.writeFSA(oracle, accounts[0], {
      type: "MY_DOMAIN_EVENT_HAPPENED",
      payload: {
        immutable: "story bro...",
        ipfs: "data bro..."
      }
    });
    let lastEvent =
      (await oracle.eventCount.call({
        from: accounts[0]
      })).toNumber() - 1;

    let retrievedEvent = await T.EventStore.readFSA(
      oracle,
      accounts[0],
      lastEvent
    );
    expect(retrievedEvent.payload.immutable).to.equal("story bro...");
  });
});

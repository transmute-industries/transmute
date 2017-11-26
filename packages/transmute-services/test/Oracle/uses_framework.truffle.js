var OracleFactory = artifacts.require(
  "./OracleFactory.sol"
);
var Oracle = artifacts.require("./Oracle.sol");

const chai = require("chai");
const expect = chai.expect;
const TransmuteFramework = require("transmute-framework").default;

contract("works with framework", accounts => {
  let factory;
  let eventStore;
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

    factory = await OracleFactory.deployed();
  });

  it("OracleFactory is deployed", async () => {
    expect(factory.address).to.be.a("string");
  });

  it("OracleFactory can create an Oracle", async () => {
    let { events, tx } = await T.Factory.createEventStore(factory, accounts[0]);
    let OracleAddress = events[0].payload.address;
  });

  it("OracleFactory can use transmute framework to get events from the factory...", async () => {
    let event = await T.EventStore.readFSA(factory, accounts[0], 0);
    expect(event.meta.txOrigin).to.equal(accounts[0]);
  });

  it("Oracle can use transmute framework to get events from the eventStore...", async () => {
    let factoryESCreatedEvent = await T.EventStore.readFSA(
      factory,
      accounts[0],
      0
    );
    eventStore = await Oracle.at(
      factoryESCreatedEvent.payload.address
    );
    let savedEvent = await T.EventStore.writeFSA(eventStore, accounts[0], {
      type: "MY_DOMAIN_EVENT_HAPPENED",
      payload: {
        immutable: "story bro...",
        ipfs: "data bro..."
      }
    });
    let lastEvent =
      (await eventStore.eventCount.call({
        from: accounts[0]
      })).toNumber() - 1;

    let retrievedEvent = await T.EventStore.readFSA(
      eventStore,
      accounts[0],
      lastEvent
    );
    expect(retrievedEvent.payload.immutable).to.equal("story bro...");
  });
});

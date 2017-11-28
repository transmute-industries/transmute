var Web3 = require("web3");
var EventStoreFactory = artifacts.require(
  "./TransmuteFramework/EventStore/Bases/EventStore/EventStoreFactory.sol"
);
var EventStore = artifacts.require(
  "./TransmuteFramework/EventStore/Bases/EventStore/EventStore.sol"
);

var _ = require("lodash");

const { getFSAFromEventArgs, getFSAFromEventValues } = require("../Common");

contract("EventStoreFactory", function(accounts) {
  var factory = null;
  var account1EventStoreAddresses = [];
  var account2EventStoreAddresses = [];
  var eventStoreAddresses = [];

  it("deployed", async () => {
    factory = await EventStoreFactory.deployed();
    let owner = await factory.owner();
    assert(owner === accounts[0]);
  });

  it("setWhitelist", async () => {
    let _tx = await factory.setWhitelist(_.concat(accounts), {
      from: accounts[0],
      gas: 2000000
    });
  });

  it("createEventStore.call", async () => {
    let firstEventStoreAddress = await factory.createEventStore.call(
      _.slice(accounts, 0, 2),
      {
        from: accounts[0]
      }
    );
    let _tx = await factory.createEventStore(_.slice(accounts, 0, 2), {
      from: accounts[0],
      gas: 2000000
    });
    let event = _tx.logs[0].args;
    let fsa = getFSAFromEventArgs(event);
    assert.equal(
      fsa.type,
      "ES_CREATED",
      "expect first event to be Type ES_CREATED"
    );
    assert.equal(
      fsa.payload.address,
      firstEventStoreAddress,
      "expected eventstore address to match call"
    );

    let esAddress = fsa.payload.address;
    let es = await EventStore.at(esAddress);
    let esOwner = await es.creator();
    assert.equal(
      esOwner,
      accounts[0],
      "expect factory caller to be eventstore owner."
    );
    eventStoreAddresses.push(esAddress);
    account1EventStoreAddresses.push(esAddress);
  });

  it("createEventStore", async () => {
    _tx = await factory.createEventStore(_.slice(accounts, 1, 3), {
      from: accounts[2],
      gas: 2000000
    });
    event = _tx.logs[0].args;
    fsa = getFSAFromEventArgs(event);
    assert.equal(
      fsa.type,
      "ES_CREATED",
      "expect first event to be Type ES_CREATED"
    );

    esAddress = fsa.payload.address;
    es = await EventStore.at(esAddress);
    esOwner = await es.creator();
    assert.equal(
      esOwner,
      accounts[2],
      "expect factory caller to be eventstore owner."
    );

    eventStoreAddresses.push(esAddress);
    account2EventStoreAddresses.push(esAddress);
  });

  it("getEventStores", async () => {
    let _addresses = await factory.getEventStores();
    assert(
      _.difference(eventStoreAddresses, _addresses).length === 0,
      "Expect eventStoreAddresses to equal _addresses"
    );
  });

  it("getEventStoresByCreator", async () => {
    let _account1EventStoreAddresses = await factory.getEventStoresByCreator.call(
      { from: accounts[1] }
    );
    assert(
      _.difference(_account1EventStoreAddresses, account1EventStoreAddresses)
        .length === 0,
      "Expect _account1EventStoreAddresses to equal account1EventStoreAddresses"
    );

    let _account2EventStoreAddresses = await factory.getEventStoresByCreator.call(
      { from: accounts[2] }
    );
    assert(
      _.difference(_account2EventStoreAddresses, account2EventStoreAddresses)
        .length === 0,
      "Expect _account2EventStoreAddresses to equal account2EventStoreAddresses"
    );
  });

  it("only deployer can killEventStore", async () => {
    return factory
      .killEventStore(account1EventStoreAddresses[0], { from: accounts[0] })
      .then(_tx => {
        let event = _tx.logs[0].args;
        let fsa = getFSAFromEventArgs(event);
        assert.equal(
          fsa.payload.address,
          account1EventStoreAddresses[0],
          "Expect the destroyed address in event to match the method call"
        );
      })
      .catch(e => {
        if (e.name == "Error") {
          assert.ok(true);
        } else {
          assert.fail("killEventStore did fail");
        }
      });
  });

  it("non-deployer cannot killEventStore", async () => {
    return factory
      .killEventStore(account2EventStoreAddresses[0], { from: accounts[1] })
      .then(_tx => {
        assert.fail("killEventStore did not fail");
      })
      .catch(e => {
        if (e.name == "Error") {
          assert.ok(true);
        } else {
          assert.fail("killEventStore did not fail");
        }
      });
  });

  it("getEventStores", async () => {
    let _addresses = await factory.getEventStores();
    assert(
      !_.includes(_addresses, account1EventStoreAddresses[0]),
      "Expect killed store to not be in factory list"
    );
    assert(
      _.includes(_addresses, account2EventStoreAddresses[0]),
      "Expect non killed store to be in list"
    );
  });
});

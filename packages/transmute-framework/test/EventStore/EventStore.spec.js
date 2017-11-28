const Web3 = require("web3");
const _ = require("lodash");

const EventStoreFactory = artifacts.require(
  "./TransmuteFramework/EventStoreFactory.sol"
);
const EventStore = artifacts.require(
  "./TransmuteFramework/EventStore.sol"
);

const { unMarshalledExpectedEvents } = require("../MockEvents");

const {
  getFSAFromEventArgs,
  getFSAFromEventValues,
  marshal,
  unmarshal
} = require("../Common");

const writeEventFromAccount = async (eventStore, originalEvent, account) => {
  let marshalledEvent = marshal(
    originalEvent.eventType,
    originalEvent.keyType,
    originalEvent.valueType,
    originalEvent.key,
    originalEvent.value
  );

  let tx = await eventStore.writeEvent(
    marshalledEvent.eventType,
    marshalledEvent.keyType,
    marshalledEvent.valueType,
    marshalledEvent.key,
    marshalledEvent.value,
    { from: account, gas: 2000000 }
  );

  let event = tx.logs[0].args;
  let eventId = event.Id.toNumber();

  let fsa = getFSAFromEventArgs(event);

  assert.equal(originalEvent.eventType, fsa.type);
  assert.equal(originalEvent.key, Object.keys(fsa.payload)[0]);
  assert.equal(originalEvent.value, fsa.payload[Object.keys(fsa.payload)[0]]);

  return eventId;
};

const readEventFromAccount = async (
  eventStore,
  originalEvent,
  eventId,
  account
) => {
  let esEventValues = await eventStore.readEvent.call(eventId, {
    from: account
  });

  assert.equal(esEventValues[0].toNumber(), eventId);
  assert.equal(esEventValues[1], account);

  fsa = getFSAFromEventValues(...esEventValues);
  // console.log(fsa)
  assert.equal(originalEvent.eventType, fsa.type);
  assert.equal(originalEvent.key, Object.keys(fsa.payload)[0]);
  assert.equal(originalEvent.value, fsa.payload[Object.keys(fsa.payload)[0]]);
};

describe("", () => {
  let factory;

  before(async () => {
    factory = await EventStoreFactory.deployed();
  });

  contract("UnsafeEventStore", accounts => {
    let eventStore;

    it("the factory whitelist cannot be set by eventstore owner or creator", async () => {
      factory
        .setWhitelist(accounts, { from: accounts[3], gas: 2000000 })
        .then(_tx => {
          assert.fail(
            "the factory whitelist can be set by eventstore owner or creator"
          );
        })
        .catch(e => {
          if (e.name == "Error") {
            assert.ok(true);
          } else {
            assert.fail(
              "the factory whitelist can be set by eventstore owner or creator"
            );
          }
        });
    });

    it("the factory whitelist includes all web3 accounts", async () => {
      await factory.setWhitelist(accounts, {
        from: accounts[0],
        gas: 2000000
      });
      let whitelist = await factory.getWhitelist({
        from: accounts[0],
        gas: 2000000
      });
      assert.deepEqual(whitelist, accounts);
    });

    it("the factory whitelist cannot be overwritten", async () => {
      factory
        .setWhitelist(_.slice(accounts, 0, 2), {
          from: accounts[0],
          gas: 2000000
        })
        .then(_tx => {
          assert.fail("the factory whitelist can be overwritten");
        })
        .catch(e => {
          if (e.name == "Error") {
            assert.ok(true);
          } else {
            assert.fail("the factory whitelist can be overwritten");
          }
        });
    });

    it("the factory caller is the event store contract creator", async () => {
      let tx = await factory.createEventStore(_.slice(accounts, 0, 2), {
        from: accounts[0],
        gas: 2000000
      });
      let fsa = getFSAFromEventArgs(tx.logs[0].args);
      eventStore = EventStore.at(fsa.payload.address);
      let creator = await eventStore.creator();
      assert(creator === accounts[0]);
    });

    it("the factory is the event store owner", async () => {
      let owner = await eventStore.owner();
      assert(owner === factory.address);
    });

    unMarshalledExpectedEvents.forEach(unMarshalledExpectedEvent => {
      it(
        "non-whitelisted accounts cannot write events of type " +
          unMarshalledExpectedEvent.valueType,
        async () => {
          writeEventFromAccount(
            eventStore,
            unMarshalledExpectedEvent,
            accounts[3]
          )
            .then(_tx => {
              assert.fail(
                "non-whitelisted accounts can write events  of type " +
                  unMarshalledExpectedEvent.valueType
              );
            })
            .catch(e => {
              if (e.name == "Error") {
                assert.ok(true);
              } else {
                assert.fail(
                  "non-whitelisted accounts can write events  of type " +
                    unMarshalledExpectedEvent.valueType
                );
              }
            });
        }
      );
    });

    unMarshalledExpectedEvents.forEach(unMarshalledExpectedEvent => {
      it(
        "whitelisted accounts can write & read events of type " +
          unMarshalledExpectedEvent.valueType,
        async () => {
          let eventId = await writeEventFromAccount(
            eventStore,
            unMarshalledExpectedEvent,
            accounts[0]
          );
          await readEventFromAccount(
            eventStore,
            unMarshalledExpectedEvent,
            eventId,
            accounts[0]
          );
        }
      );
    });

    it("the event count is equal to the number of mock events", async () => {
      let eventCount = await eventStore.eventCount();
      assert.equal(unMarshalledExpectedEvents.length, eventCount);
    });

    unMarshalledExpectedEvents.forEach(unMarshalledExpectedEvent => {
      it(
        "non-whitelisted accounts cannot read events of type " +
          unMarshalledExpectedEvent.valueType,
        async () => {
          let eventId = await writeEventFromAccount(
            eventStore,
            unMarshalledExpectedEvent,
            accounts[0]
          );
          readEventFromAccount(
            eventStore,
            unMarshalledExpectedEvent,
            eventId,
            accounts[3]
          )
            .then(_tx => {
              assert.fail(
                "non-whitelisted accounts can read events  of type " +
                  unMarshalledExpectedEvent.valueType
              );
            })
            .catch(e => {
              if (e.name == "Error") {
                assert.ok(true);
              } else {
                assert.fail(
                  "non-whitelisted accounts can read events  of type " +
                    unMarshalledExpectedEvent.valueType
                );
              }
            });
        }
      );
    });

    it("non-owner cannot destroy eventStore", async () => {
      return eventStore
        .destroy({ from: accounts[1] })
        .then(_tx => {
          assert.fail("non-owner can destroy eventStore");
        })
        .catch(e => {
          if (e.name == "Error") {
            assert.ok(true);
          } else {
            assert.fail("non-owner can destroy eventStore");
          }
        });
    });

    it("owner can destroy eventStore", async () => {
      return eventStore
        .destroy({ from: accounts[1] })
        .then(_tx => {
          assert.fail("owner cannot destroy eventStore");
        })
        .catch(e => {
          if (e.name == "Error") {
            assert.ok(true);
          } else {
            assert.fail("owner cannot destroy eventStore");
          }
        });
    });
  });
});

const EventStoreFactory = artifacts.require('./EventStoreFactory.sol');
const EventStore = artifacts.require('./EventStore.sol');

contract('EventStoreFactory', accounts => {
  let factory;

  before(async () => {
    factory = await EventStoreFactory.deployed();
  });

  it('deployed', async () => {
    assert(accounts[0] === (await factory.owner()));
  });

  it("createEventStore", async () => {
    const _address = await factory.createEventStore.call({ from: accounts[2] });
    await factory.createEventStore({ from: accounts[2] });
    const eventStore = await EventStore.at(_address);
  });

  it("getEventStores", async () => {
    let _addresses = await factory.getEventStores();
    assert(_addresses.length === 1);
  });
});

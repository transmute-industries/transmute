const EventStore = artifacts.require('./EventStore.sol');
const EventStoreFactory = artifacts.require('./EventStoreFactory.sol');

module.exports = (deployer) => {
  deployer.deploy(EventStore);
  deployer.link(EventStore, EventStoreFactory);
  deployer.deploy(EventStoreFactory);
};

const EventStoreLib = artifacts.require('./EventStoreLib.sol');
const EventStore = artifacts.require('./EventStore.sol');

module.exports = deployer => {
  deployer.deploy(EventStoreLib);
  deployer.link(EventStoreLib, EventStore);
  deployer.deploy(EventStore);
};

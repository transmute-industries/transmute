const EventStoreLib = artifacts.require(
  'transmute-eventstore/contracts/EventStoreLib.sol'
);
const EventStore = artifacts.require(
  'transmute-eventstore/contracts/EventStore.sol'
);

const ESigner = artifacts.require('./ESigner.sol');

module.exports = deployer => {
  deployer.deploy(EventStoreLib);
  deployer.link(EventStoreLib, EventStore);
  deployer.deploy(EventStore);

  deployer.link(EventStoreLib, ESigner);
  deployer.link(EventStore, ESigner);
  deployer.deploy(ESigner);
};

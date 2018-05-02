const EventStoreFactory = require('./event-store-factory');
const EventStore = require('./event-store');
const StreamModel = require('./stream-model');
const IpfsAdapter = require('./decentralized-storage/ipfs');

module.exports = {
  EventStoreFactory,
  EventStore,
  StreamModel,
  IpfsAdapter
};

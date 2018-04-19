'use strict';

var EventStoreFactory = require('./event-store-factory');

var EventStore = require('./event-store');

var StreamModel = require('./stream-model');

var IpfsAdapter = require('./decentralized-storage/ipfs');

module.exports = {
  EventStoreFactory: EventStoreFactory,
  EventStore: EventStore,
  StreamModel: StreamModel,
  IpfsAdapter: IpfsAdapter
};

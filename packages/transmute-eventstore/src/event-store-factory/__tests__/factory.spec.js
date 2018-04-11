const EventStoreFactory = require('../index.js');
const transmuteConfig = require('../../../../../transmute-config');
const eventStoreFactoryArtifact = require('../../../build/contracts/EventStoreFactory.json');

describe('transmute-eventstore-factory', () => {
  let accounts;
  let eventStoreFactory;

  beforeAll(async () => {
    eventStoreFactory = new EventStoreFactory({
      eventStoreFactoryArtifact,
      ...transmuteConfig
    });
    await eventStoreFactory.init();
    accounts = await eventStoreFactory.getWeb3Accounts();
  });

  describe('createEventStore', () => {
    it('can create an EventStore', async () => {
      console.log("creating an eventstore");
      let result = await eventStoreFactory.createEventStore(
        accounts[0]
      );
      console.log("eventstore created")

      let eventStores = await eventStoreFactory.getEventStores();
      expect(eventStores.length).toBe(1);
    });
  });
});

const EventStore = require('../index.js');

const transmuteConfig = require('../../transmute-config');
const eventStoreArtifact = require('../../../build/contracts/EventStore.json');


describe('transmute-framework', () => {
  describe('constructor', () => {
    it('is safe', async () => {
      expect(() => {
        const eventStore = new EventStore();
      }).toThrow();
      expect(() => {
        const eventStore = new EventStore({});
      }).toThrow();
      const eventStore = new EventStore({
        eventStoreArtifact,
        ...transmuteConfig
      });
    });
    it('sets version', async () => {
      const eventStore = new EventStore({
        eventStoreArtifact,
        ...transmuteConfig
      });
      expect(eventStore.version).toBe('0.2.0-alpha.2');
    });
  });

  describe('clone', () => {
    it('returns a new EventStore with a new contract instance.', async () => {
      const eventStore = new EventStore({
        eventStoreArtifact,
        ...transmuteConfig
      });
      const accounts = await eventStore.getWeb3Accounts();
      let newEventStore = await eventStore.clone(accounts[0]);
      expect(
        newEventStore.eventStoreContract.address !==
          eventStore.eventStoreContract.address
      );
    });
  });

  describe('healthy', () => {
    it('throws when not init', async () => {
      try {
        const eventStore = new EventStore({
          eventStoreArtifact,
          ...transmuteConfig
        });
        const info = await eventStore.healthy();
      } catch (e) {
        // expected...
      }
    });
  });
});

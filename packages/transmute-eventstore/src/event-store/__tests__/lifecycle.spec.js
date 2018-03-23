const TransmuteEventStore = require('../index.js');

const { env } = require('../../../../../transmute-config');
const eventStoreArtifact = require('../../../build/contracts/EventStore.json');

describe('transmute-eventstore', () => {
  describe('constructor', () => {
    it('is safe', async () => {
      expect(() => {
        const eventStore = new TransmuteEventStore();
      }).toThrow();
      expect(() => {
        const eventStore = new TransmuteEventStore({});
      }).toThrow();
      const eventStore = new TransmuteEventStore({
        eventStoreArtifact,
        ...env.localhost
      });
    });
    it('sets version', async () => {
      const eventStore = new TransmuteEventStore({
        eventStoreArtifact,
        ...env.localhost
      });
      expect(eventStore.version).toBe('0.0.1');
    });
  });

  describe('clone', () => {
    it('returns a new TransmuteEventStore with a new contract instance.', async () => {
      const eventStore = new TransmuteEventStore({
        eventStoreArtifact,
        ...env.localhost
      });
      const accounts = await eventStore.web3.eth.getAccounts();
      let newEventStore = await eventStore.clone(accounts[0]);
      expect(
        newEventStore.eventStoreContract.address !==
          eventStore.eventStoreContract.address
      );
    });
  });

  describe('healthy', () => {
    it('checks that all services are connected', async () => {
      const eventStore = new TransmuteEventStore({
        eventStoreArtifact,
        ...env.localhost
      });
      const info = await eventStore.healthy();
    });
  });
});

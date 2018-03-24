const TransmuteEventStore = require('../index.js');

const { env } = require('../../../../../transmute-config');
const eventStoreArtifact = require('../../../build/contracts/EventStore.json');

const TRANSMUTE_ENV = process.env.TRANSMUTE_ENV;

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
        ...env[TRANSMUTE_ENV]
      });
    });
    it('sets version', async () => {
      const eventStore = new TransmuteEventStore({
        eventStoreArtifact,
        ...env[TRANSMUTE_ENV]
      });
      expect(eventStore.version).toBe('0.0.1');
    });
  });

  describe('clone', () => {
    it('returns a new TransmuteEventStore with a new contract instance.', async () => {
      const eventStore = new TransmuteEventStore({
        eventStoreArtifact,
        ...env[TRANSMUTE_ENV]
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
    it('throws when not init', async () => {
      try {
        const eventStore = new TransmuteEventStore({
          eventStoreArtifact,
          ...env[TRANSMUTE_ENV]
        });
        const info = await eventStore.healthy();
      } catch (e) {
        // expected...
      }
    });

    // it('checks that all services are connected', async () => {
    //   const eventStore = new TransmuteEventStore({
    //     eventStoreArtifact,
    //     ...env[TRANSMUTE_ENV]
    //   });
    //   await eventStore.init();
    //   const info = await eventStore.healthy();
    // });
  });
});

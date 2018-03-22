const TransmuteEventStore = require('./index.js');

const { env } = require('../transmute-config');
const eventStoreArtifact = require('../build/contracts/EventStore.json');

describe('transmute-eventstore', () => {

  // describe('constructor', () => {
  //   it('is safe', async () => {
  //     expect(() => {
  //       const eventStore = new TransmuteEventStore();
  //     }).toThrow();

  //     expect(() => {
  //       const eventStore = new TransmuteEventStore({});
  //     }).toThrow();

  //     const eventStore = new TransmuteEventStore({
  //       eventStoreArtifact,
  //       ...env.localhost
  //     });
  //   });

  //   it('sets version', async () => {
  //     const eventStore = new TransmuteEventStore({
  //       eventStoreArtifact,
  //       ...env.localhost
  //     });
  //     expect(eventStore.version).toBe('0.0.1');
  //   });
  // });

  // describe('healthy', () => {
  //   it('checks that all services are connected', async () => {
  //     const eventStore = new TransmuteEventStore({
  //       eventStoreArtifact,
  //       ...env.localhost
  //     });
  //     const info = await eventStore.healthy();
  //   });
  // });

  describe('write', () => {
    it('writes to ipfs', async () => {

      const eventStore = new TransmuteEventStore({
        eventStoreArtifact,
        ...env.localhost
      });

      let evt = await eventStore.write({
        type: 'HELLO',
        payload: {
          alice: 1,
          bob: 2
        }
      });

      console.log(evt)


    });
  });
});

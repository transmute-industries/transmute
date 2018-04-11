const EventStore = require('../index.js');
const transmuteConfig = require('../../../../../transmute-config');
const eventStoreArtifact = require('../../../build/contracts/EventStore.json');

const mockEvents = require('../../__mock__/events.json');

describe('transmute-eventstore', () => {
  let accounts;
  let eventStore;

  beforeAll(async () => {
    eventStore = new EventStore({
      eventStoreArtifact,
      ...transmuteConfig
    });
    await eventStore.init();
    accounts = await eventStore.getWeb3Accounts();
  });

  // new event store per test
  beforeEach(async () => {
    eventStore = await eventStore.clone(accounts[0]);
  });

  describe('write', () => {
    it('can save events', async () => {
      return Promise.all(
        mockEvents.map(async event => {
          let result = await eventStore.write(
            accounts[0],
            event.key,
            event.value
          );
          expect(result.event).toBeDefined();
          expect(result.event.sender).toBeDefined();
          expect(result.event.key).toBeDefined();
          expect(result.event.value).toBeDefined();
          expect(result.meta).toBeDefined();
          expect(result.meta.tx).toBeDefined();
          expect(result.meta.ipfs).toBeDefined();
          expect(result.meta.bytes32).toBeDefined();
          expect(result.meta.receipt).toBeDefined();
        })
      );
    });
  });

  describe('read', () => {
    it('can read events', async () => {
      const mockEvent = mockEvents[0];

      let result = await eventStore.write(
        accounts[0],
        mockEvent.key,
        mockEvent.value
      );

      let event = await eventStore.read(0, accounts[0]);
      expect(event.sender).toBeDefined();
      expect(event.key).toBeDefined();
      expect(event.value).toBeDefined();
    });
  });

  describe('getSlice', () => {
    it('supports getting a single event', async () => {
      const mockEvent = mockEvents[0];
      let result = await eventStore.write(
        accounts[0],
        mockEvent.key,
        mockEvent.value
      );

      let events = await eventStore.getSlice(0, 0);

      // avoid checksum errors
      expect(events[0].sender).toEqual(accounts[0].toLowerCase());
      expect(events[0].key).toEqual(mockEvents[0].key);
      expect(events[0].value).toEqual(mockEvents[0].value);
    });

    it('supports getting a slice', async () => {
      await eventStore.write(
        accounts[0],
        mockEvents[0].key,
        mockEvents[0].value
      );

      await eventStore.write(
        accounts[0],
        mockEvents[1].key,
        mockEvents[1].value
      );

      await eventStore.write(
        accounts[0],
        mockEvents[2].key,
        mockEvents[2].value
      );

      let events = await eventStore.getSlice(0, 2);
      expect(events.length).toBe(3);
    });
  });
});

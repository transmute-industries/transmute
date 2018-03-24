const TransmuteEventStore = require('../index.js');
const { env } = require('../../../../../transmute-config');
const eventStoreArtifact = require('../../../build/contracts/EventStore.json');

const events = require('../../__mock__/events.json');


const TRANSMUTE_ENV = process.env.TRANSMUTE_ENV;

const eventStore = new TransmuteEventStore({
  eventStoreArtifact,
  ...env[TRANSMUTE_ENV]
});

describe('transmute-eventstore', () => {
  describe('write', () => {
    it('can save events', async () => {
      await eventStore.init();
      const accounts = await eventStore.web3.eth.getAccounts();
      events.map(async event => {
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
      });
    });
  });

  describe('read', () => {
    it('can read events', async () => {
      await eventStore.init();
      const accounts = await eventStore.web3.eth.getAccounts();
      let event = await eventStore.read(0, accounts[0]);
      expect(event.sender).toBeDefined();
      expect(event.key).toBeDefined();
      expect(event.value).toBeDefined();
    });
  });

  // describe('getSlice', () => {
  //   it.skip('throws on invalid params', async () => {

  //     expect(() => {
  //       let events = eventStore.getSlice(1, 0);
  //     }).toThrow();
  //   });

  //   it('supports getting a single event', async () => {
  //     await eventStore.init()
  //     let events = await eventStore.getSlice(0, 0);
  //     const accounts = await eventStore.web3.eth.getAccounts();
  //     // avoid checksum errors
  //     expect(events[0].sender).toEqual(accounts[0].toLowerCase());
  //     expect(events[0].key).toEqual(mockEvents[0].key);
  //     expect(events[0].value).toEqual(mockEvents[0].value);
  //   });

  //   it('supports getting a slice', async () => {
  //     await eventStore.init()
  //     let events = await eventStore.getSlice(0, 3);
  //     expect(events.length).toBe(4)
  //   });
  // });
});

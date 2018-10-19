const Web3 = require('web3');
const TransmuteAdapterIPFS = require('transmute-adapter-ipfs');
const EventStore = require('../index.js');
const transmuteConfig = require('../../transmute-config');
const abi = require('../../../build/contracts/EventStore.json');

const mockEvents = require('../../__mock__/events.json');

const provider = new Web3.providers.HttpProvider(
  transmuteConfig.web3Config.providerUrl,
);
const web3 = new Web3(provider);
const adapter = new TransmuteAdapterIPFS(transmuteConfig.ipfsConfig);
let eventStore = new EventStore({
  web3,
  abi,
  adapter,
});

describe('transmute-framework', () => {
  let accounts;

  beforeAll(async () => {
    await eventStore.init();
    accounts = await eventStore.getWeb3Accounts();
  });

  // new event store per test
  beforeEach(async () => {
    eventStore = await eventStore.clone(accounts[0]);
  });

  describe('write', () => {
    it('can save key/value pairs', async () => Promise.all(
      mockEvents.map(async (event) => {
        const result = await eventStore.write(
          accounts[0],
          event.key,
          event.value,
        );
        expect(result.event).toBeDefined();
        expect(result.event.sender).toBe(accounts[0]);
        expect(result.event.content.key).toEqual(event.key);
        expect(result.event.content.value).toEqual(event.value);
        expect(result.meta).toBeDefined();
        expect(result.meta.tx).toBeDefined();
        expect(result.meta.contentID).toBeDefined();
        expect(result.meta.receipt).toBeDefined();
      }),
    ));
    it('can save arbitrary JSON objects', async () => {
      const arbitraryJson = {
        foo: 1,
        bar: {
          lol: 'mdr',
        },
      };
      const result = await eventStore.write(
        accounts[1],
        arbitraryJson,
      );
      expect(result).toBeDefined();
      expect(result.event.sender).toBe(accounts[1]);
      expect(result.event.content).toEqual(arbitraryJson);
      expect(result.meta).toBeDefined();
      expect(result.meta.tx).toBeDefined();
      expect(result.meta.contentID).toBeDefined();
      expect(result.meta.receipt).toBeDefined();
    });
  });

  describe('read', () => {
    it('can read events', async () => {
      const mockEvent = mockEvents[0];

      await eventStore.write(
        accounts[0],
        mockEvent.key,
        mockEvent.value,
      );

      const event = await eventStore.read(0, accounts[0]);
      expect(event).toBeDefined();
      expect(event.index).toBe(0);
      expect(event.sender).toBe(accounts[0]);
      expect(event.content.key).toEqual(mockEvent.key);
      expect(event.content.value).toEqual(mockEvent.value);
    });
  });

  describe('getSlice', () => {
    it('supports getting a single event', async () => {
      const mockEvent = mockEvents[0];
      await eventStore.write(
        accounts[0],
        mockEvent.key,
        mockEvent.value,
      );

      const events = await eventStore.getSlice(0, 0);

      // avoid checksum errors
      expect(events[0].sender).toEqual(accounts[0].toLowerCase());
      expect(events[0].content.key).toEqual(mockEvent.key);
      expect(events[0].content.value).toEqual(mockEvent.value);
    });

    it('supports getting a slice', async () => {
      await eventStore.write(
        accounts[0],
        mockEvents[0].key,
        mockEvents[0].value,
      );

      await eventStore.write(
        accounts[0],
        mockEvents[1].key,
        mockEvents[1].value,
      );

      await eventStore.write(
        accounts[0],
        mockEvents[2].key,
        mockEvents[2].value,
      );

      const events = await eventStore.getSlice(0, 2);
      expect(events.length).toBe(3);
    });
  });
});

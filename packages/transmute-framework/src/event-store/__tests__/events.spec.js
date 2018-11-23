const Web3 = require('web3');
const TransmuteAdapterIPFS = require('@transmute/transmute-adapter-ipfs');
const EventStore = require('../index.js');
const transmuteConfig = require('../../transmute-config');
const abi = require('../../../build/contracts/EventStore.json');
const mockEvents = require('../../__mock__/events.json');

const provider = new Web3.providers.HttpProvider(transmuteConfig.web3Config.providerUrl);
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
    accounts = await web3.eth.getAccounts();
    await eventStore.init();
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
    });
  });

  describe('read', () => {
    it('should read event informations', async () => {
      const mockEvent = mockEvents[0];
      const writeEventResult = await eventStore.write(
        accounts[0],
        mockEvent.key,
        mockEvent.value,
      );
      const { index } = writeEventResult.event;
      const event = await eventStore.read(index, accounts[0]);
      expect(event).toBeDefined();
      expect(event.index).toBeGreaterThanOrEqual(0);
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
      expect(events[0].sender).toEqual(accounts[0]);
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

  describe('batchRead', () => {
    beforeEach(async () => {
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
    });

    const expectEventToEqual = (event, mockEvent, index) => {
      expect(event.index).toBe(index);
      expect(event.sender).toEqual(accounts[0]);
      expect(event.content.key).toEqual(mockEvent.key);
      expect(event.content.value).toEqual(mockEvent.value);
    };

    it('supports getting a single event', async () => {
      const mockEvent = mockEvents[0];
      const events = await eventStore.batchRead([0]);
      expect(events).toHaveLength(1);
      expectEventToEqual(events[0], mockEvent, 0);
    });

    it('supports getting multiple contiguous events', async () => {
      const events = await eventStore.batchRead([0, 1, 2]);
      expect(events).toHaveLength(3);
      expectEventToEqual(events[0], mockEvents[0], 0);
      expectEventToEqual(events[1], mockEvents[1], 1);
      expectEventToEqual(events[2], mockEvents[2], 2);
    });

    it('supports getting multiple non contiguous events', async () => {
      const events = await eventStore.batchRead([0, 2]);
      expect(events).toHaveLength(2);
      expectEventToEqual(events[0], mockEvents[0], 0);
      expectEventToEqual(events[1], mockEvents[2], 2);
    });

    it('should throw if index does not exist', async () => {
      expect.assertions(1);
      await expect(eventStore.batchRead([3])).rejects.toThrowError();
    });

    it('should throw if Ethereum event log cannot be read', async () => {
      // Mock function to throw
      const { getPastEvents } = eventStore.eventStoreContractInstance;
      eventStore.eventStoreContractInstance.getPastEvents = jest.fn().mockRejectedValueOnce();

      expect.assertions(1);
      await expect(eventStore.batchRead([0])).rejects.toThrowError();

      // Restore original function
      eventStore.eventStoreContractInstance.getPastEvents = getPastEvents;
    });

    it('should throw if contentHash cannot be resolved', async () => {
      // Mock function to throw
      const { readJson } = eventStore.adapter;
      eventStore.adapter.readJson = jest.fn().mockRejectedValueOnce();

      expect.assertions(1);
      await expect(eventStore.batchRead([0])).rejects.toThrowError();

      // Restore original function
      eventStore.adapter.readJson = readJson;
    });
  });
});

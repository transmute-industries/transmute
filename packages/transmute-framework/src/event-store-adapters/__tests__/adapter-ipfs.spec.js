const Web3 = require('web3');
const TransmuteAdapterIPFS = require('@transmute/transmute-adapter-ipfs');
const EventStore = require('../../event-store');
const abi = require('../../../build/contracts/EventStore.json');
const transmuteConfig = require('../../transmute-config');

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
let accounts;

describe('EventStore with IPFS Adapter', () => {
  beforeAll(async () => {
    accounts = await eventStore.getWeb3Accounts();
    eventStore = await eventStore.clone(accounts[0]);
  });

  it('supports the ipfs adapter', async () => {
    expect(eventStore).toBeDefined();
    await eventStore.init();

    const writeEventResult = await eventStore.write(
      accounts[0],
      mockEvents[0].key,
      mockEvents[0].value,
    );

    expect(writeEventResult.event).toBeDefined();
    expect(writeEventResult.meta).toBeDefined();

    const readEventResult = await eventStore.read(0);
    expect(readEventResult.content.key).toEqual(mockEvents[0].key);
    expect(readEventResult.content.value).toEqual(mockEvents[0].value);
  });
});

const Web3 = require('web3');
const TransmuteAdapterFirestore = require('transmute-adapter-firestore');

const adapter = new TransmuteAdapterFirestore({}, 'events');

const contentID = '0xcb2402ae09412ffb174e20aa741a7ec0b82338a9a471b4f848e2c9684fcd6a21';

const contentObject = {
  first: 'Ada',
  born: 1999,
  last: 'Lovelace',
};

adapter.readJson = jest.fn().mockImplementation(() => contentObject);
adapter.writeJson = jest.fn().mockImplementation(() => contentID);

const EventStore = require('../../event-store');
const abi = require('../../../build/contracts/EventStore.json');
const transmuteConfig = require('../../transmute-config');

const provider = new Web3.providers.HttpProvider(
  transmuteConfig.web3Config.providerUrl,
);
const web3 = new Web3(provider);
const eventStore = new EventStore({
  web3,
  abi,
  adapter,
});

describe('EventStore with Firestore Adapter', () => {
  it('supports the firestore adapter', async () => {
    expect(eventStore).toBeDefined();
    await eventStore.init();
    const accounts = await web3.eth.getAccounts();
    const writeEventResult = await eventStore.write(
      accounts[0],
      contentObject,
    );

    expect(writeEventResult.event).toBeDefined();
    expect(writeEventResult.meta).toBeDefined();

    const readEventResult = await eventStore.read(0);
    expect(readEventResult.content).toEqual(contentObject);
  });
});

const Web3 = require('web3');
const TransmuteAdapterIPFS = require('transmute-adapter-ipfs');
const EventStore = require('../../event-store');
const transmuteConfig = require('../../transmute-config');
const contractJson = require('../../../build/contracts/EventStore.json');

const provider = new Web3.providers.HttpProvider(transmuteConfig.web3Config.providerUrl);
const web3 = new Web3(provider);
const adapter = new TransmuteAdapterIPFS(transmuteConfig.ipfsConfig);
const { abi, networks } = contractJson;
const latestDeploy = Object.keys(networks).pop();
const { address } = networks[latestDeploy];
const eventStore = new EventStore({
  web3,
  abi,
  address,
  adapter,
});

const contentID = '0xcb2402ae09412ffb174e20aa741a7ec0b82338a9a471b4f848e2c9684fcd6a21';
const contentObject = {
  first: 'Ada',
  born: 1999,
  last: 'Lovelace',
};
describe('EventStore with Firestore Adapter', () => {
  let accounts;

  beforeAll(async () => {
    accounts = await web3.eth.getAccounts();
  });
  it('supports the firestore adapter', async () => {
    expect(eventStore).toBeDefined();
    const writeEventResult = await eventStore.write(
      accounts[0],
      contentObject,
    );

    expect(writeEventResult.event).toBeDefined();
    expect(writeEventResult.event.contentHash).toBe(contentID);
    expect(writeEventResult.meta).toBeDefined();

    const { index } = writeEventResult.event;
    const readEventResult = await eventStore.read(index);
    expect(readEventResult.content).toEqual(contentObject);
  });
});

const Web3 = require('web3');
const TransmuteAdapterIPFS = require('transmute-adapter-ipfs');
const EventStore = require('../../event-store');
const transmuteConfig = require('../../transmute-config');
const contractJson = require('../../../build/contracts/EventStore.json');
const mockEvents = require('../../__mock__/events.json');

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

// TODO: add test for adapter Firebase RTDB
describe('EventStore with IPFS Adapter', () => {
  let accounts;

  beforeAll(async () => {
    accounts = await web3.eth.getAccounts();
  });

  it('supports the ipfs adapter', async () => {
    expect(eventStore).toBeDefined();

    const writeEventResult = await eventStore.write(
      accounts[0],
      mockEvents[0].key,
      mockEvents[0].value,
    );

    expect(writeEventResult.event).toBeDefined();
    expect(writeEventResult.meta).toBeDefined();

    const { index } = writeEventResult.event;
    const readEventResult = await eventStore.read(index);
    expect(readEventResult.content.key).toEqual(mockEvents[0].key);
    expect(readEventResult.content.value).toEqual(mockEvents[0].value);
  });
});

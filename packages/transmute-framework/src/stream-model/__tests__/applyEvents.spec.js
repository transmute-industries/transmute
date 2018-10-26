const Web3 = require('../../web3');
const TransmuteAdapterIPFS = require('@transmute/transmute-adapter-ipfs');
const { EventStore } = require('../../index');
const transmuteConfig = require('../../transmute-config');
const abi = require('../../../build/contracts/EventStore.json');

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

const StreamModel = require('../index');

const events = require('../../__mock__/events.json');

describe('applyEvents', () => {
  let accounts;
  let streamModel;

  const filter = event => event;
  const reducer = (state, event) => ({
    ...state,
    events: [event.value, ...(state.events || [])],
    eventsProcessed: (state.eventsProcessed || 0) + 1,
  });

  beforeAll(async () => {
    eventStore = new EventStore({
      web3,
      abi,
      adapter,
    });
    await eventStore.init();
    accounts = await eventStore.getWeb3Accounts();
  });

  // new event store per test
  beforeEach(async () => {
    eventStore = await eventStore.clone(accounts[0]);
    streamModel = new StreamModel(eventStore, filter, reducer);
  });

  it('should be idempotent', async () => {
    streamModel.applyEvents(events);
    expect(streamModel.state.model).toMatchSnapshot();
    streamModel.applyEvents(events);
    expect(streamModel.state.model).toMatchSnapshot();
  });

  it('should support custom event filters', async () => {
    const customFilter = event => event.key.type === 'patient' && event.key.id === '0';
    const streamModelInstance = new StreamModel(eventStore, customFilter, reducer);
    streamModelInstance.applyEvents(events);
    expect(streamModelInstance.state.model).toMatchSnapshot();
  });
});

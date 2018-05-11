const { EventStore } = require('../../index');
const transmuteConfig = require('../../transmute-config');
const eventStoreArtifact = require('../../../build/contracts/EventStore.json');

const eventStore = new EventStore({
  eventStoreArtifact,
  ...transmuteConfig
});

const StreamModel = require('../index');

const events = require('../../__mock__/events.json');

describe('applyEvents', () => {
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

  it('idempotent', async () => {
    const filter = event => {
      return true;
    };
    const reducer = (state, event) => {
      return state;
    };
    const streamModel = new StreamModel(eventStore, filter, reducer);
    streamModel.applyEvents(events);
    expect(streamModel.state.contractAddress).toEqual(
      eventStore.eventStoreContractInstance.address
    );
  });

  it('respects filter', async () => {
    const filter = event => {
      return event.key.type === 'patient' && event.key.id === '0';
    };
    const reducer = (state, event) => {
      return {
        ...state,
        events: [...(state.events || []), event]
      };
    };
    const streamModel = new StreamModel(eventStore, filter, reducer);
    streamModel.applyEvents(events);
    expect(streamModel.state.model).toMatchSnapshot();
  });
});

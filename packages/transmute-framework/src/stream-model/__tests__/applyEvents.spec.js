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
  let streamModel;

  const filter = event => {
    return true;
  };
  const reducer = (state, event) => {
    return {
      ...state,
      events: [event.value, ...(state.events || [])],
      eventsProcessed: (state.eventsProcessed || 0) + 1
    };
  };

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
    streamModel = new StreamModel(eventStore, filter, reducer);
  });

  it('should be idempotent', async () => {
    streamModel.applyEvents(events);
    expect(streamModel.state.model).toMatchSnapshot();
    streamModel.applyEvents(events);
    expect(streamModel.state.model).toMatchSnapshot();
  });

  it('should support custom event filters', async () => {
    const custom_filter = event => {
      return event.key.type === 'patient' && event.key.id === '0';
    };
    const streamModel = new StreamModel(eventStore, custom_filter, reducer);
    streamModel.applyEvents(events);
    expect(streamModel.state.model).toMatchSnapshot();
  });
});

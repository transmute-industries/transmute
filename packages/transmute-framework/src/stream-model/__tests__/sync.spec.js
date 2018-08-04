const { EventStore } = require('../../index');
const transmuteConfig = require('../../transmute-config');
const eventStoreArtifact = require('../../../build/contracts/EventStore.json');

const StreamModel = require('../index');

const mockEvents = require('../../__mock__/events.json');

describe('sync', () => {
  let accounts;
  let eventStore;

  const filter = event => {
    return true;
  };

  // here we accumulate events and count them as they are processed.
  // we use this reducer to test that events are not processed multiple times when sync is called.
  const reducer = (state, event) => {
    return {
      ...state,
      events: [event.value, ...(state.events || [])],
      eventsProcessed: (state.eventsProcessed || 0) + 1
    };
  };

  const expectUnchanged = (streamModel, eventCount) => {
    expect(streamModel.state.model.eventsProcessed).toBe(eventCount);
    expect(streamModel.state.model).toMatchSnapshot();
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
  });

  it('should handle the empty case, where lastIndex is always null', async () => {
    const streamModel = new StreamModel(eventStore, filter, reducer);
    // sync with no events in contract
    await streamModel.sync();
    expect(streamModel.state.lastIndex).toBe(null);
  });

  it('should handle new events, where lastIndex is the id of the last event', async () => {
    const streamModel = new StreamModel(eventStore, filter, reducer);

    await eventStore.write(accounts[0], mockEvents[0].key, mockEvents[0].value);

    await streamModel.sync();
    expect(streamModel.state.model.eventsProcessed).toBe(1);
    expect(streamModel.state.lastIndex).toBe(0);

    await streamModel.sync();
    expect(streamModel.state.model.eventsProcessed).toBe(1);
    expect(streamModel.state.lastIndex).toBe(0);

    await eventStore.write(accounts[0], mockEvents[1].key, mockEvents[1].value);

    await streamModel.sync();
    expect(streamModel.state.model.eventsProcessed).toBe(2);
    expect(streamModel.state.lastIndex).toBe(1);
  });

  it('should handle persisted state', async () => {
    const streamModel = new StreamModel(eventStore, filter, reducer);
    await eventStore.write(accounts[0], mockEvents[0].key, mockEvents[0].value);
    await streamModel.sync();
    expect(streamModel.state.lastIndex).toBe(0);

    await eventStore.write(accounts[0], mockEvents[1].key, mockEvents[1].value);

    const streamModel2 = new StreamModel(
      eventStore,
      filter,
      reducer,
      streamModel.state // this is initializing a stream model from state
    );

    await streamModel2.sync();
    expect(streamModel2.state.lastIndex).toBe(1);
  });

  it('should handle multiple calls to sync correctly', async () => {
    const filter = event => {
      return true;
    };

    const streamModel = new StreamModel(eventStore, filter, reducer);
    await eventStore.write(accounts[0], mockEvents[0].key, mockEvents[0].value);

    let eventCount = (await eventStore.eventStoreContractInstance.count.call()).toNumber();

    await streamModel.sync();
    expectUnchanged(streamModel, eventCount);

    await streamModel.sync();
    expectUnchanged(streamModel, eventCount);

    await eventStore.write(accounts[0], mockEvents[1].key, mockEvents[1].value);
    eventCount = (await eventStore.eventStoreContractInstance.count.call()).toNumber();

    await streamModel.sync();
    expectUnchanged(streamModel, eventCount);
    await streamModel.sync();
    expectUnchanged(streamModel, eventCount);
  });
});

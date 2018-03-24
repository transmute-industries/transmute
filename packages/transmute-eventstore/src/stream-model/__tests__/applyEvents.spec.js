const TransmuteEventStore = require('../../index');
const { env } = require('../../../../../transmute-config');
const eventStoreArtifact = require('../../../build/contracts/EventStore.json');

const TRANSMUTE_ENV = process.env.TRANSMUTE_ENV;

const eventStore = new TransmuteEventStore({
  eventStoreArtifact,
  ...env[TRANSMUTE_ENV]
});

const StreamModel = require('../index');

const events = require('../../__mock__/events.json');

describe('applyEvents', () => {
  beforeAll(async () => {
    await eventStore.init();
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
    expect(streamModel.state).toMatchSnapshot();
  });
});
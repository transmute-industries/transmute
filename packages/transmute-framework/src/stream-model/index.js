/**
 * A module for applying events to reducers and creating stream models
 * @module src/stream-model
 */

/** @class StreamModel */
module.exports = class StreamModel {
  /**
   * Creates a new StreamModel.
   * @constructor
   * @memberof StreamModel
   * @param {EventStore} eventStore - EventStore where events will originate from.
   * @param {function} filter - Filter function for filtering events.
   * @param {function} reducer - Reducer function for reducing events to a model.
   * @param {Object} state - State object that is used with the reducer.
   */
  constructor(eventStore, filter, reducer, state) {
    eventStore.requireInstance();
    this.eventStore = eventStore;
    this.filter = filter;
    this.reducer = reducer;
    this.state = state || {
      contractAddress: this.eventStore.eventStoreContractInstance.address,
      model: {},
      lastIndex: null,
    };
  }

  /**
   * Applies an event to this StreamModel's reducer
   * @function
   * @memberof StreamModel
   * @name applyEvent
   * @param {Object} event - An event object.
   */
  applyEvent(event) {
    this.state.model = this.reducer(this.state.model, event);
    this.state.lastIndex = event.index;
  }

  /**
   * Applies an array of events to this StreamModel's reducer
   * @function
   * @memberof StreamModel
   * @name applyEvents
   * @param {Array.<Object>} events - An array event objects.
   */
  applyEvents(events) {
    events.filter(this.filter).map(this.applyEvent.bind(this));
  }

  /**
   * Checks EventStore for events which have not been applied to the StreamModel and applies them.
   * @function
   * @memberof StreamModel
   * @name sync
   */
  async sync() {
    const eventCount = (await this.eventStore.eventStoreContractInstance.count.call()).toNumber();
    if (eventCount === 0) {
      return;
    }
    if (
      this.state.lastIndex === null
      || this.state.lastIndex + 1 < eventCount
    ) {
      const start = this.state.lastIndex === null ? 0 : this.state.lastIndex + 1;
      const end = eventCount - 1;
      const updates = await this.eventStore.getSlice(start, end);
      this.applyEvents(updates);
    }
  }
};

module.exports = class StreamModel {
  constructor(eventStore, filter, reducer, state) {
    eventStore.requireInstance();
    this.eventStore = eventStore;
    this.filter = filter;
    this.reducer = reducer;
    this.state = state || {
      contractAddress: this.eventStore.eventStoreContractInstance.address,
      model: {},
      lastIndex: null
    };
  }

  applyEvent = event => {
    this.state.model = this.reducer(this.state.model, event);
    this.state.lastIndex = event.index;
  };

  applyEvents = events => {
    events.filter(this.filter).map(this.applyEvent);
  };

  sync = async () => {
    const web3 = this.eventStore.web3;
    const eventCount = (await this.eventStore.eventStoreContractInstance.count.call()).toNumber();
    if (eventCount === 0) {
      return;
    }
    if (this.state.lastIndex == null || this.state.lastIndex < eventCount) {
      const updates = await this.eventStore.getSlice(
        this.state.lastIndex || 0,
        eventCount - 1
      );
      this.applyEvents(updates);
    }
  };
};

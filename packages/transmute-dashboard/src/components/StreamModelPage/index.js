import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import Button from 'material-ui/Button';

import StreamModelTable from '../StreamModelTable';

import { reducer as EventsReducer } from '../../store/documents/reducer';
import { filters } from '../../filters/Events';

let eventStoreArtifact = require('../../contracts/EventStore.json');
let transmuteConfig = require('../../transmute-config');

const {
  EventStore,
  StreamModel
} = require('transmute-eventstore/dist/transmute-eventstore.cjs');

class StreamModelPage extends Component {
  state = {
    accounts: null,
    eventStore: null,
    events: []
  };

  createStreamModel = async () => {
    const maybeAddress = window.location.pathname.split('/')[2];
    const accessToken = (await this.props.auth.getAccessToken()) || '';
    transmuteConfig.ipfsConfig.authorization = 'Bearer ' + accessToken;

    const eventStore = new EventStore({
      eventStoreArtifact,
      ...transmuteConfig
    });

    eventStore.eventStoreContractInstance = await eventStore.eventStoreContract.at(
      maybeAddress
    );

    let totalCount = (await eventStore.eventStoreContractInstance.count.call()).toNumber();

    const accounts = await eventStore.getWeb3Accounts();

    let events = [];
    if (totalCount) {
      events = await eventStore.getSlice(0, totalCount - 1);

      events = events.map(event => {
        return {
          ...event,
          id: event.index
        };
      });
    }

    const url = new URL(window.location.href);
    const filter = filters(url.searchParams.get("filter"));

    const streamModel = new StreamModel(eventStore, filter, EventsReducer);
    streamModel.applyEvents(events);

    this.setState({
      accounts,
      eventStore,
      events,
      streamModel: streamModel.state.model
    });
  };

  async componentWillMount() {
    await this.createStreamModel();
  }

  render() {
    return (
      <div>
        <StreamModelTable streamModel={this.state.streamModel} />
      </div>
    );
  }
}

export default withAuth(
  connect(null, null)(StreamModelPage)
);

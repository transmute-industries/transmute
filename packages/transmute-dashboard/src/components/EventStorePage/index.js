import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import Button from 'material-ui/Button';

import EventsTable from './EventsTable';
import RecordEventDialog from './RecordEventDialog';

import { EventStore } from 'transmute-eventstore';
import AppBar from '../AppBar';

let eventStoreArtifact = require('../../contracts/EventStore.json');
let transmuteConfig = require('../../transmute-config');

class EventStorePage extends Component {
  state = {
    accounts: null,
    eventStore: null,
    events: []
  };

  loadAllEvents = async () => {
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

    this.setState({
      accounts,
      eventStore,
      events
    });
  };

  async componentWillMount() {
    await this.loadAllEvents();
  }

  onSaveEvent = async someEvent => {
    let parsedEvent = JSON.parse(someEvent);
    let { eventStore, accounts } = this.state;
    let result = await eventStore.write(
      accounts[0],
      parsedEvent.key,
      parsedEvent.value
    );
    await this.loadAllEvents();
  };

  render() {
    return (
      <AppBar>
        <RecordEventDialog
          defaultEvent={this.props.defaultEvent}
          onSave={this.onSaveEvent}
          history={this.props.history}
        />
        <EventsTable events={this.state.events} />
      </AppBar>
    );
  }
}

export default (connect(null, null)(withAuth(EventStorePage)));

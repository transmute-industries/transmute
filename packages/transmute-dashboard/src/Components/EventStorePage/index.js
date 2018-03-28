import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';

import AppBar from '../AppBar';

import Button from 'material-ui/Button';

import EventsTable from '../EventsTable';
import RecordEventDialog from '../RecordEventDialog';

// import axios from 'axios';

// import Web3 from 'web3';

let eventStoreArtifact = require('../../contracts/EventStore.json');
let transmuteConfig = require('../../transmute-config');
let ipfsProvider = `${transmuteConfig.ipfsConfig.protocol}//${
  transmuteConfig.ipfsConfig.host
}:${transmuteConfig.ipfsConfig.port}`;
// console.log(ipfsProvider);
const {
  EventStore
} = require('transmute-eventstore/dist/transmute-eventstore.cjs');

class EventStorePage extends Component {
  state = {
    accounts: null,
    eventStore: null,
    events: []
  };

  loadAllEvents = async () => {
    const maybeAddress = window.location.pathname.split('/')[2];
    // console.log(maybeAddress);
    const accessToken = (await this.props.auth.getAccessToken()) || '';
    transmuteConfig.ipfsConfig.authorization = 'Bearer ' + accessToken;

    const eventStore = new EventStore({
      eventStoreArtifact,
      ...transmuteConfig
    });
    eventStore.eventStoreContractInstance = await eventStore.eventStoreContract.at(
      maybeAddress
    );
    // console.log(await eventStore.eventStoreContractInstance.owner.call());

    let totalCount = (await eventStore.eventStoreContractInstance.count.call()).toNumber();

    // console.log(events);

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
    // console.log('save the event...', someEvent);
    let parsedEvent = JSON.parse(someEvent);
    let { eventStore, accounts } = this.state;
    // console.log(parsedEvent);
    let result = await eventStore.write(
      accounts[0],
      parsedEvent.key,
      parsedEvent.value
    );
    console.log(result);
    await this.loadAllEvents();
  };
  render() {
    return (
      <AppBar>
        <RecordEventDialog
          defaultEvent={this.props.defaultEvent}
          onSave={this.onSaveEvent}
        />
        <EventsTable events={this.state.events} />
      </AppBar>
    );
  }
}

function mapStateToProps(state) {
  return {
    pathname: state.router.location,
    defaultEvent: {
      index: '1',
      key: {
        type: 'patient',
        id: '0'
      },
      value: {
        type: 'USER_REGISTERED',
        username: 'bob@example.com'
      }
    }
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        go: somePath => push(somePath)
      },
      dispatch
    )
  };
}

export default withAuth(
  connect(mapStateToProps, mapDispatchToProps)(EventStorePage)
);

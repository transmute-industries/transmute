import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Button from 'material-ui/Button';

import EventStoresTable from './EventStoresTable';

import { EventStoreFactory, EventStore } from 'transmute-eventstore';
import AppBar from '../AppBar';

let eventStoreArtifact = require('../../contracts/EventStore.json');
let eventStoreFactoryArtifact = require('../../contracts/EventStoreFactory.json');
let transmuteConfig = require('../../transmute-config');

class EventStoreFactoryPage extends Component {
  state = {
    accounts: null,
    eventStoreFactory: null,
    eventStores: []
  };

  loadAllEventStores = async () => {
    const maybeAddress = window.location.pathname.split('/')[2];
    const accessToken = (await this.props.auth.getAccessToken()) || '';
    transmuteConfig.ipfsConfig.authorization = 'Bearer ' + accessToken;

    const eventStoreFactory = new EventStoreFactory({
      eventStoreFactoryArtifact,
      ...transmuteConfig
    });

    eventStoreFactory.eventStoreFactoryContractInstance = await eventStoreFactory.eventStoreFactoryContract.at(
      maybeAddress
    );

    const eventStore = new EventStore({
      eventStoreArtifact,
      ...transmuteConfig
    });

    const accounts = await eventStoreFactory.getWeb3Accounts();

    let eventStoreAddresses = [], eventStores = [];
    eventStoreAddresses = await eventStoreFactory.getEventStores();


    eventStores = await Promise.all(eventStoreAddresses.map(async eventStoreAddress => {
      let eventStoreContractInstance = await eventStore.eventStoreContract.at(eventStoreAddress);
      return {
        ...eventStoreContractInstance,
        owner: await eventStoreContractInstance.owner(),
        count: (await eventStoreContractInstance.count()).toNumber(),
        address: eventStoreAddress,
        id: eventStoreAddresses.indexOf(eventStoreAddress)
      };
    }));

    this.setState({
      accounts,
      eventStoreFactory,
      eventStores
    });
  };

  async componentWillMount() {
    await this.loadAllEventStores();
  }

  createEventStore = async () => {
    let { eventStoreFactory, accounts } = this.state;
    let result = await eventStoreFactory.createEventStore(accounts[0]);
    await this.loadAllEventStores();
  };

  render() {
    return (
      <AppBar>
        <Button
          variant="raised"
          color="secondary"
          onClick={this.createEventStore}
        >
          Create EventStore
        </Button>
        <EventStoresTable eventStores={this.state.eventStores} history={this.props.history}/>
      </AppBar>
    );
  }
}

// We need an intermediary variable for handling the recursive nesting.
export default (connect(null, null)(withAuth(EventStoreFactoryPage)));

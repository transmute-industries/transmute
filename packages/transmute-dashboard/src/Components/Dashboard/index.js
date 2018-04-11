import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import Button from 'material-ui/Button';

let eventStoreFactoryArtifact = require('../../contracts/EventStoreFactory.json');

let transmuteConfig = require('../../transmute-config');

const {
  EventStoreFactory
} = require('transmute-eventstore/dist/transmute-eventstore.cjs');

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { defaultEventStoreFactoryContractAddress: null };
  }

  async componentWillMount() {
    const eventStoreFactory = new EventStoreFactory({
      eventStoreFactoryArtifact,
      ...transmuteConfig
    });

    await eventStoreFactory.init();
    console.log('eventStoreFactory: ', eventStoreFactory);

    this.setState({
      defaultEventStoreFactoryContractAddress:
        eventStoreFactory.eventStoreFactoryContractInstance.address
    });
  }

  render() {
    return (
      <Button
        variant="raised"
        color="secondary"
        href={"/eventstorefactory/" + this.state.defaultEventStoreFactoryContractAddress}
      >
        Demo EventStoreFactory
      </Button>
    );
  }
}

export default withAuth(Dashboard);

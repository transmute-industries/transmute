import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import Button from 'material-ui/Button';

let eventStoreArtifact = require('../../contracts/EventStore.json');

let transmuteConfig = require('../../transmute-config');

const {
  EventStore
} = require('transmute-eventstore/dist/transmute-eventstore.cjs');

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { defaultEventStoreContractAddress: null };
  }

  async componentWillMount() {
    const eventStore = new EventStore({
      eventStoreArtifact,
      ...transmuteConfig
    });

    await eventStore.init();

    this.setState({
      defaultEventStoreContractAddress:
        eventStore.eventStoreContractInstance.address
    });
  }

  render() {
    return (
      <Button
        variant="raised"
        color="secondary"
        href={"/eventstore/" + this.state.defaultEventStoreContractAddress}
      >
        Demo EventStore
        </Button>
    );
  }
}

export default withAuth(Dashboard);

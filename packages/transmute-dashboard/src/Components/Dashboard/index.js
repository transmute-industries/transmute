import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';

import AppBar from '../AppBar';

import Button from 'material-ui/Button';

import EventsTable from '../EventsTable';

import axios from 'axios';

import Web3 from 'web3';

let eventStoreArtifact = require('../../contracts/EventStore.json');

let transmuteConfig = require('../../transmute-config');

let ipfsProvider = `${transmuteConfig.ipfsConfig.protocol}//${
  transmuteConfig.ipfsConfig.host
}:${transmuteConfig.ipfsConfig.port}`;

console.log(ipfsProvider);
const {
  EventStore,
  IpfsAdapter
} = require('transmute-eventstore/dist/transmute-eventstore.cjs');

// console.log(transmuteConfig, TransmuteEventStore)

class Dashboard extends Component {
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
      <AppBar>
        {/* <Button
          variant="raised"
          color="secondary"
          onClick={async () => {
            const accessToken = (await this.props.auth.getAccessToken()) || '';
            transmuteConfig.ipfsConfig.authorization = 'Bearer ' + accessToken;
            // console.log(transmuteConfig);
            let ipfs = new IpfsAdapter({
              ...transmuteConfig.ipfsConfig
            });
            let data = await ipfs.healthy();
            console.log(data);
          }}
        >
          IPFS
        </Button> */}

        <Button
          variant="raised"
          color="secondary"
          onClick={() => {
            this.props.actions.go(
              '/eventstore/' + this.state.defaultEventStoreContractAddress
            );
          }}
        >
          Demo EventStore
        </Button>
      </AppBar>
    );
  }
}

function mapStateToProps(state) {
  return {
    pathname: state.router.location
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
  connect(mapStateToProps, mapDispatchToProps)(Dashboard)
);

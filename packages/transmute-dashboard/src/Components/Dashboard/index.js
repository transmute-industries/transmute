import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';

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
  render() {
    return (
      <AppBar>
        <EventsTable />
        <Button
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
            // console.log(data);
            // axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
            // console.log(accessToken);
            // let data = await axios
            //   .create({
            //     baseURL: 'https://orie.transmute.live:32443',
            //     timeout: 1000
            //   })
            //   .get('/api/v0/id' );
            // console.log(data);
          }}
        >
          IPFS
        </Button>

        <Button
          variant="raised"
          color="secondary"
          onClick={async () => {
            const accessToken = (await this.props.auth.getAccessToken()) || '';
            transmuteConfig.ipfsConfig.authorization = 'Bearer ' + accessToken;

            console.log(accessToken);

            console.log(transmuteConfig);

            const eventStore = new EventStore({
              eventStoreArtifact,
              ...transmuteConfig
            });

            await eventStore.init();

            const accounts = await eventStore.getWeb3Accounts();
            console.log(accounts);

            let event = {
              index: '1',
              key: {
                type: 'patient',
                id: '0'
              },
              value: {
                type: 'USER_REGISTERED',
                username: 'bob@example.com'
              }
            };

            let result = await eventStore.write(
              accounts[0],
              event.key,
              event.value
            );

            console.log(result);

            // console.log(accessToken);

            // // const accounts = await eventStore.getWeb3Accounts();
            // // let newEventStore = await eventStore.clone(accounts[0]);

            // let resp = await axios
            //   .create({
            //     baseURL: ipfsHost,
            //     timeout: 1000
            //   })
            //   .get('/api/v0/id?jwt=' + accessToken);

            // console.log(resp.data);
          }}
        >
          EventStore
        </Button>
      </AppBar>
    );
  }
}

export default withAuth(Dashboard);

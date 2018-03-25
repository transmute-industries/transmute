import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';

import AppBar from './AppBar';
import axios from 'axios';




const TransmuteEventStore = require('transmute-eventstore/dist/transmute-eventstore.cjs');

const transmuteConfig = require('../transmute-config');

const eventStoreArtifact = require('transmute-eventstore/build/contracts/EventStore.json');

export default withAuth(
  class Home extends Component {
    constructor(props) {
      super(props);
      this.state = { authenticated: null };
      this.checkAuthentication = this.checkAuthentication.bind(this);
      this.checkAuthentication();
    }

    async checkAuthentication() {
      const authenticated = await this.props.auth.isAuthenticated();
      if (authenticated !== this.state.authenticated) {
        this.setState({ authenticated });
      }
    }

    componentDidUpdate() {
      this.checkAuthentication();
    }

    render() {
      if (this.state.authenticated === null) return null;
      return (
        <AppBar>
          {this.state.authenticated ? (
            <button onClick={this.props.auth.logout}>Logout</button>
          ) : (
            <button onClick={this.props.auth.login}>Login</button>
          )}
          <br />
          <br />
          <div>
            <h4>test ipfs...</h4>
            <pre>
              {JSON.stringify(
                {
                  accounts: this.state.accounts
                },
                null,
                2
              )}
            </pre>
            <button
              onClick={async () => {
                console.log('testing...', transmuteConfig);

                const accessToken = await this.props.auth.getAccessToken();
                console.log(accessToken);

                let data = await axios.get(
                  `${transmuteConfig.ipfsConfig.protocol}://${
                    transmuteConfig.ipfsConfig.host
                  }:${
                    transmuteConfig.ipfsConfig.port
                  }/api/v0/id?jwt=${accessToken}`
                );

                console.log(data);

                // const eventStore = new TransmuteEventStore({
                //   eventStoreArtifact,
                //   ...transmuteConfig
                // });
                // await eventStore.init();
                // const accounts = await eventStore.getWeb3Accounts();

                // this.setState({
                //   accounts
                // });
              }}
            >
              Check IPFS health
            </button>
          </div>
        </AppBar>
      );
    }
  }
);

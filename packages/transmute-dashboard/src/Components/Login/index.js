import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';

import AppBar from '../AppBar';

import Button from 'material-ui/Button';

// import IPFS from 'transmute-kepler';

// import transmuteConfig from '../../transmute-config.json';

// const config = transmuteConfig.dev.ipfs.config;

// import Playground from 'playground-js-api'

// var config = {...};
// Playground.authenticate(config, "qsocks").then(function(ticket){
//   config.ticket = ticket
//   qsocks.ConnectOpenApp(config).then(function(result){
//     //we're now connected
//   });
// });

class Login extends Component {
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
    return (
      <AppBar>
        {this.state.authenticated ? (
          <Button
            variant="raised"
            color="secondary"
            onClick={this.props.auth.logout}
          >
            Logout
          </Button>
        ) : (
          <Button
            variant="raised"
            color="secondary"
            onClick={this.props.auth.login}
          >
            Login
          </Button>
        )}
      </AppBar>
    );
  }
}

export default withAuth(Login);

import React from 'react';

import { Route } from 'react-router';

import { Security, ImplicitCallback } from '@okta/okta-react';

import Home from '../Home';
import Kepler from '../Kepler';

const config = {
  issuer: 'https://dev-665774.oktapreview.com/oauth2/default',
  redirect_uri: window.location.origin + '/implicit/callback',
  client_id: '0oaed6dpppzPxFKTp0h7'
};

class Routes extends React.Component {
  render() {
    return (
      <Security
        issuer={config.issuer}
        client_id={config.client_id}
        redirect_uri={config.redirect_uri}
      >
        <Route path="/" exact={true} component={Home} />
        <Route path="/kepler" exact={true} component={Kepler} />
        <Route path="/implicit/callback" component={ImplicitCallback} />
      </Security>
    );
  }
}

export default Routes;
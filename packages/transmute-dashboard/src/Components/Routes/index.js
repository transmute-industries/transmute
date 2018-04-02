import React from 'react';

import { Route } from 'react-router';

import { Security, ImplicitCallback } from '@okta/okta-react';

import Home from '../Home';
import Login from '../Login';
import Settings from '../Settings';
import Dashboard from '../Dashboard';
import EventStorePage from '../EventStorePage';

const config = {
  issuer: '$OKTA_HOSTNAME',
  redirect_uri: window.location.origin + '/implicit/callback',
  client_id: '$OKTA_CLIENT_ID'
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
        <Route path="/login" exact={true} component={Login} />
        <Route path="/settings" exact={true} component={Settings} />
        <Route path="/dashboard" exact={true} component={Dashboard} />
        <Route path="/eventstore/:address" exact={true} component={EventStorePage} />
        <Route path="/implicit/callback" component={ImplicitCallback} />
      </Security>
    );
  }
}

export default Routes;

import React from 'react';

import { Route } from 'react-router-dom';

import {
  Security,
  SecureRoute,
  ImplicitCallback,
  Auth
} from '@okta/okta-react';

import config from './config';

import AppBar from '../AppBar';
import Home from '../Home';
import Login from '../Login';
import Register from '../Register';
import Settings from '../Settings';
import Dashboard from '../Dashboard';
import EventStorePage from '../EventStorePage';

const auth = new Auth({
  issuer: config.issuer,
  client_id: config.client_id,
  redirect_uri: config.redirect_uri
});

class Routes extends React.Component {
  render() {
    return (
      <Security auth={auth}>
        <AppBar>
          <Route path="/" exact={true} component={Home} />
          <Route
            path="/login"
            exact={true}
            render={() => <Login baseUrl={config.url} />}
          />
          <Route path="/register" exact={true} render={() => <Register />} />
          <SecureRoute path="/settings" exact={true} component={Settings} />
          <SecureRoute path="/dashboard" exact={true} component={Dashboard} />
          <SecureRoute
            path="/eventstore/:address"
            exact={true}
            component={EventStorePage}
          />
          <Route path="/implicit/callback" component={ImplicitCallback} />
        </AppBar>
      </Security>
    );
  }
}

export default Routes;

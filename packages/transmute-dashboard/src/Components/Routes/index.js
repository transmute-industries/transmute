import React from 'react';

import { Route, Switch } from 'react-router-dom';

import { Security, SecureRoute, ImplicitCallback, Auth } from '@okta/okta-react';

import config from './config';

import AppBar from '../AppBar';
import Home from '../Home';
import Login from '../Login';
import Settings from '../Settings';
import Dashboard from '../Dashboard';
import EventStoreFactoryPage from '../EventStoreFactoryPage';
import EventStorePage from '../EventStorePage';
import StreamModelPage from '../StreamModelPage';

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
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path='/login' exact render={() => <Login baseUrl={config.url} />} />
            <SecureRoute path="/settings" exact component={Settings} />
            <SecureRoute path="/dashboard" exact component={Dashboard} />
            <SecureRoute path="/eventstorefactory/:address" exact component={EventStoreFactoryPage} />
            <SecureRoute path="/eventstore/:address/model" component={StreamModelPage} />
            <SecureRoute path="/eventstore/:address" exact component={EventStorePage} />
            <Route path="/implicit/callback" component={ImplicitCallback} />
          </Switch>
        </AppBar>
      </Security>
    );
  }
}

export default Routes;

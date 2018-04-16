import React from 'react';

import { Route, Switch } from 'react-router-dom';

import { Security, SecureRoute, ImplicitCallback, Auth } from '@okta/okta-react';

import config from '../../okta_config';

import AppBar from '../AppBar';
import Home from '../Home';
import Login from '../Auth/Login';
import Register from '../Register';
import Dashboard from '../Dashboard';
import EventStoreFactoryPage from '../EventStoreFactoryPage';
import EventStorePage from '../EventStorePage';
import StreamModelPage from '../StreamModelPage';

function onAuthRequired({ history }) {
  history.push('/login');
}

const auth = new Auth({
  issuer: config.issuer,
  client_id: config.client_id,
  redirect_uri: config.redirect_uri,
  onAuthRequired: { onAuthRequired }
});

class Routes extends React.Component {
  render() {
    return (
      <Security auth={auth}>
        <AppBar>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path='/login' exact render={() => <Login baseUrl={config.url} />} />
            <Route path='/register' exact render={() => <Register />} />
            <Route path="/implicit/callback" component={ImplicitCallback} />
            <SecureRoute path="/dashboard" exact component={Dashboard} />
            <SecureRoute path="/eventstorefactory/:address" exact component={EventStoreFactoryPage} />
            <SecureRoute path="/eventstore/:address" exact component={EventStorePage} />
            <SecureRoute path="/eventstore/:address/model" component={StreamModelPage} />
          </Switch>
        </AppBar>
      </Security>
    );
  }
}

export default Routes;
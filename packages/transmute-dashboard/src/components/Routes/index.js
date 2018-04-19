import React from 'react';

import { Route, Switch } from 'react-router-dom';

import { Security, SecureRoute, ImplicitCallback, Auth } from '@okta/okta-react';

import config from '../../okta_config';

import Home from '../Home';
import Login from '../Auth/Login';
import Register from '../Register';
import Dashboard from '../Dashboard';
import EventStoreFactoryPage from '../EventStoreFactoryPage';
import EventStorePage from '../EventStorePage';
import StreamModelPage from '../StreamModelPage';
import DocumentsPage from '../DocumentsPage';

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
        <Switch>
          <Route path="/transmute" exact component={Home} />
          <Route path='/transmute/login' exact render={() => <Login baseUrl={config.url} />} />
          <Route path='/transmute/register' exact render={() => <Register />} />
          <Route path="/transmute/implicit/callback" component={ImplicitCallback} />
          <SecureRoute path="/transmute/dashboard" exact component={Dashboard} />
          <SecureRoute path="/transmute/eventstorefactory/:address" exact component={EventStoreFactoryPage} />
          <SecureRoute path="/transmute/eventstore/:address/model" component={StreamModelPage} />
          <SecureRoute path="/transmute/eventstore/:address/documents" component={DocumentsPage} />
          <SecureRoute path="/transmute/eventstore/:address" exact component={EventStorePage} />
        </Switch>
      </Security>
    );
  }
}

export default Routes;
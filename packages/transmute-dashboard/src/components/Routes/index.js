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
import SignaturePage from '../SignaturePage';
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
          <Route path="/" exact component={Home} />
          <Route path='/login' exact render={() => <Login baseUrl={config.url} />} />
          <Route path='/register' exact render={() => <Register />} />
          <Route path="/implicit/callback" component={ImplicitCallback} />
          <SecureRoute path="/dashboard" exact component={Dashboard} />
          <SecureRoute path="/eventstorefactory/:address" exact component={EventStoreFactoryPage} />
          <SecureRoute path="/eventstore/:address/model" component={StreamModelPage} />
          <SecureRoute path="/eventstore/:address/documents" component={DocumentsPage} />
          <SecureRoute path="/eventstore/:address/signature" component={SignaturePage} />
          <SecureRoute path="/eventstore/:address" exact component={EventStorePage} />
        </Switch>
      </Security>
    );
  }
}

export default Routes;
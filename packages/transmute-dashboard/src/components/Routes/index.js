import React from 'react';

import { Route, Switch, Redirect } from 'react-router-dom';

import {
  Security,
  SecureRoute,
  ImplicitCallback,
  Auth
} from '@okta/okta-react';

import { history } from '../../store';
import config from '../../okta_config';

import Home from '../Home';
import Demo from '../Demo';
import Login from '../Auth/Login';
import Register from '../Register';
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
  onAuthRequired: onAuthRequired,
  history
});

class Routes extends React.Component {
  render() {
    return (
      <Security auth={auth}>
        <Switch>
          {/* <Route path="/" exact component={Home} /> */}
          <Route exact path="/" render={() => <Redirect to="/demo" />} />
          <Route
            path="/login"
            exact
            render={() => <Login baseUrl={config.url} />}
          />
          <Route path="/register" exact render={() => <Register />} />

          <Route path="/demo" component={Demo} />

          <Route path="/implicit/callback" component={ImplicitCallback} />
          <Route
            path="/eventstorefactory/:address"
            exact
            component={EventStoreFactoryPage}
          />
          <Route
            path="/eventstore/:address/model"
            component={StreamModelPage}
          />
          <Route
            path="/eventstore/:address/documents"
            component={DocumentsPage}
          />
          <Route path="/eventstore/:address" exact component={EventStorePage} />
        </Switch>
      </Security>
    );
  }
}

export default Routes;

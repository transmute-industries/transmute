import React from 'react';

import { Route, Switch, Redirect } from 'react-router-dom';

import {
  Security,
  SecureRoute,
  ImplicitCallback,
  Auth
} from '@okta/okta-react';

import { history } from '../../store'
import config from '../../okta_config';

import Home from '../Home';
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
          {/* <Route exact path="/" render={() => <Redirect to="/transmute" />} /> */}
          <Route path="/" exact component={Home} />
          <Route
            path="/login"
            exact
            render={() => <Login baseUrl={config.url} />}
          />
          <Route path="/register" exact render={() => <Register />} />
          <Route
            path="/implicit/callback"
            component={ImplicitCallback}
          />
          <SecureRoute
            path="/eventstorefactory/:address"
            exact
            component={EventStoreFactoryPage}
          />
          <SecureRoute
            path="/eventstore/:address/model"
            component={StreamModelPage}
          />
          <SecureRoute
            path="/eventstore/:address/documents"
            component={DocumentsPage}
          />
          <SecureRoute
            path="/eventstore/:address"
            exact
            component={EventStorePage}
          />
        </Switch>
      </Security>
    );
  }
}

export default Routes;

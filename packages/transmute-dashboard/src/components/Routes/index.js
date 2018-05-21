import React from 'react';

import { Route, Switch } from 'react-router-dom';

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
import Register from '../Auth/Register';
import Profile from '../Profile';
import GroupsPage from '../Groups/GroupsPage';
import GroupPage from '../Groups/GroupPage';
import EventStoreFactoryPage from '../EventStoreFactoryPage';
import EventStorePage from '../EventStorePage';
import StreamModelPage from '../StreamModelPage';



const auth = new Auth({
  issuer: config.issuer,
  client_id: config.client_id,
  redirect_uri: config.redirect_uri,
  history
});

class Routes extends React.Component {
  render() {
    return (
      <Security auth={auth}>
        <Switch>
          <Route
            path="/demo"
            component={Demo}
          />
          <Route
            path="/"
            exact
            component={Home}
          />
        
          <Route 
            path="/register"
            exact
            render={() => <Register />}
          />
          <Route
            path="/implicit/callback"
            component={ImplicitCallback}
          />
          <SecureRoute
            path="/profile"
            exact
            render={() => <Profile />}
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
            path="/eventstore/:address"
            exact
            component={EventStorePage}
          />
          <SecureRoute path="/groups" exact render={() => <GroupsPage />} />
          <SecureRoute
            path="/groups/:id"
            exact
            render={() => <GroupPage />}
          />
        </Switch>
      </Security>
    );
  }
}

export default Routes;

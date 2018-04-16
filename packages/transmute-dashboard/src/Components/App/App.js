import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { Route } from 'react-router-dom';
import { Security, SecureRoute, ImplicitCallback } from '@okta/okta-react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { store, history } from '../../store';
import theme from '../../theme';
import config from '../../okta_config';
import Home from '../Home';
import Account from '../Account';
import Login from '../Auth/Login';
import Register from '../Register';
import EventStorePage from '../EventStorePage';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <Security
              issuer={config.issuer}
              client_id={config.client_id}
              redirect_uri={config.redirect_uri}
            >
              <Route path="/" exact={true} component={Home} />
              <Route
                path="/login"
                exact={true}
                render={() => <Login baseUrl={config.url} />}
              />
              <Route
                path="/register"
                exact={true}
                render={() => <Register />}
              />
              <Route path="/implicit/callback" component={ImplicitCallback} />
              <SecureRoute
                path="/eventstore/:address"
                exact={true}
                component={EventStorePage}
              />
              <SecureRoute path="/account" exact={true} component={Account} />
            </Security>
          </ConnectedRouter>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;

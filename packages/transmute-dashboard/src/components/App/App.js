import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { Route } from 'react-router-dom';
import { Security, SecureRoute, ImplicitCallback } from '@okta/okta-react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { store, history, persistor } from '../../store';
import { PersistGate } from 'redux-persist/integration/react';
import Routes from '../Routes';
import theme from '../../theme';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ConnectedRouter history={history}>
              <Routes />
            </ConnectedRouter>
          </PersistGate>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
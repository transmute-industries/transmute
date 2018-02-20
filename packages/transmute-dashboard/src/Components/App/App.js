import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { store, history } from '../../store';
import theme from '../../theme';
// import Routes from '../../Routes';

// import * as T from 'transmute-framework'
// console.log(T)

import Routes from '../Routes';

import AppBar from '../AppBar';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <MuiThemeProvider theme={theme}>
            <AppBar>
              <Routes />
            </AppBar>
          </MuiThemeProvider>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;

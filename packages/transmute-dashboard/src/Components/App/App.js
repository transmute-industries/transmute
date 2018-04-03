import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { store } from '../../store';
import theme from '../../theme';

import Routes from '../Routes';

import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <MuiThemeProvider theme={theme}>
              <ToastContainer />
              <Routes />
          </MuiThemeProvider>
        </Router>
      </Provider>
    );
  }
}

export default App;

import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';

import AppBar from './AppBar';
import axios from 'axios';

export default class Home extends Component {
  render() {
    return (
      <AppBar>
        <h3>Welcome </h3>
      </AppBar>
    );
  }
}

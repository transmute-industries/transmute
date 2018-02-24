import React from 'react';

import { Route } from 'react-router';

import Home from '../Home';
import Status from '../Status';

class Routes extends React.Component {
  render() {
    return (
      <div>
        <Route exact={true} path="/" component={Home} />
        <Route exact={true} path="/status" component={Status} />
      </div>
    );
  }
}

export default Routes;

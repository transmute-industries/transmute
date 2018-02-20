import React from 'react';

import { Route } from 'react-router';

import Home from '../Home';

class Routes extends React.Component {
  render() {
    return (
      <div>
        <Route exact={true} path="/" component={Home} />
      </div>
    );
  }
}

export default Routes;

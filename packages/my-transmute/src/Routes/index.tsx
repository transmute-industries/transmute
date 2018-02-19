import * as React from 'react';

import { Route } from 'react-router';

import { Home } from './Home';
import { Factory } from './Factory';

class Routes extends React.Component {
  render() {
    return (
      <div>
        <Route exact={true} path="/" component={Home} />
        <Route exact={true} path="/factory" component={Factory} />
      </div>
    );
  }
}

export default Routes;

import React from 'react';

// import { Route } from 'react-router';

// import Home from '../Home';
import Status from '../Status';


class Routes extends React.Component {
  render() {
    return (
      <div>

        <Status />
        {/* <Route exact={true} path="/" component={Status} /> */}
        {/* <Route exact={true} path="/status" component={Status} /> */}
      </div>
    );
  }
}

export default Routes;

import React from 'react';

// import { Route } from 'react-router';

// import Home from '../Home';
// import Status from '../Status';
import Demo from '../Demo';

class Routes extends React.Component {
  render() {
    return (
      <div>
        <Demo />
        {/* <Route exact={true} path="/" component={Status} /> */}
        {/* <Route exact={true} path="/status" component={Status} /> */}
      </div>
    );
  }
}

export default Routes;

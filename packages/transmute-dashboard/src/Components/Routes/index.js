import React from 'react';

import { Route } from 'react-router';

// import Home from '../Home';
// import Status from '../Status';
import Demo from '../Demo';

import Login from '../Login';

import Auth from '../Auth/Auth';
import Callback from '../Callback/Callback'

const auth = new Auth();

const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
}


class Routes extends React.Component {
  render() {
    return (
      <div>
        {/* <Demo /> */}
        <Route exact={true} path="/" component={Demo} />
        <Route exact={true} path="/login" component={Login} />
        <Route path="/callback" render={(props) => {
          handleAuthentication(props);
          return <Callback {...props} /> 
        }}/>
      </div>
    );
  }
}

export default Routes;

import React, { Component } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { withAuth } from '@okta/okta-react';

import AppBar from '../AppBar';

import * as actionsCreators from '../../store/user/actionCreators';

class AccountPage extends Component {
  async componentWillMount() {
    if (!this.props.user.info) {
      const user = await this.props.auth.getUser();
      this.props.setUserInfo(user);
    }
  }
  
  render() {
    return (
      <AppBar>
        <h1>Account</h1>
        <pre>{JSON.stringify(this.props.user.info, null, 2)}</pre>
      </AppBar>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    go: () => dispatch(push('/protected')),
    setUserInfo: async oktaUser => {
      dispatch(actionsCreators.setUserInfo(oktaUser));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withAuth(AccountPage)
);

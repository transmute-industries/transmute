import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import Button from 'material-ui/Button';
export default withAuth(
  class OktaAuthButton extends Component {
    constructor(props) {
      super(props);
      this.state = { authenticated: null };
      this.checkAuthentication = this.checkAuthentication.bind(this);
      this.checkAuthentication();
      this.login = this.login.bind(this);
      this.logout = this.logout.bind(this);
    }

    async checkAuthentication() {
      const authenticated = await this.props.auth.isAuthenticated();
      if (authenticated !== this.state.authenticated) {
        this.setState({ authenticated });
      }
    }

    componentDidUpdate() {
      this.checkAuthentication();
    }

    async login() {
      this.props.auth.login('/');
    }

    async logout() {
      this.props.auth.logout('/');
    }

    render() {
      if (this.state.authenticated === null) return null;
      return this.state.authenticated ? (
        <Button variant="raised" color="primary" onClick={this.logout}>
          Logout
        </Button>
      ) : (
        <Button variant="raised" color="primary" onClick={this.login}>
          Login
        </Button>
      );
    }
  }
);

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';

import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

import { withAuth } from '@okta/okta-react';

import {
  Fingerprint,
  Dashboard,
  Settings,
  HelpOutline,
  BugReport,
  Code
} from 'material-ui-icons';

class PrimaryMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { authenticated: null };
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.checkAuthentication();
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

  render() {
    return (
      <List>
        {this.state.authenticated && [
          <ListItem button key={'account'}>
            <ListItemIcon>
              <Fingerprint />
            </ListItemIcon>
            <ListItemText primary="Account" />
          </ListItem>,
          <ListItem button key={'dashboard'}>
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>,
          <ListItem
            button
            key={'settings'}
            onClick={() => {
              this.props.actions.go('/settings');
            }}
          >
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        ]}
      </List>
    );
  }
}

function mapStateToProps(state) {
  return { todos: state.todos };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        go: somePath => push(somePath)
      },
      dispatch
    )
  };
}

export default withAuth(
  connect(mapStateToProps, mapDispatchToProps)(PrimaryMenu)
);

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';

import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import { withAuth } from '@okta/okta-react';

import { Fingerprint, Dashboard, Settings } from 'material-ui-icons';

class PrimaryMenu extends Component {
  render() {
    return (
      <List>
        <ListItem button key={'account'}>
          <ListItemIcon>
            <Fingerprint />
          </ListItemIcon>
          <ListItemText primary="Account" />
        </ListItem>
        <ListItem
          button
          key={'dashboard'}
          onClick={() => {
            this.props.actions.go('/dashboard');
          }}
        >
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
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

        <Divider />
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

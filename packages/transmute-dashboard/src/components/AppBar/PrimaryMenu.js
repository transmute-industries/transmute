import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import { withAuth } from '@okta/okta-react';

import { Fingerprint, Dashboard, Settings } from 'material-ui-icons';

class PrimaryMenu extends Component {
  render() {
    return (
      <List>
        <ListItem button key={'home'}>
          <Link to="/">
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
          </Link>
          <ListItemText primary="Dashboard" />
        </ListItem>
        {/* <ListItem button key={'account'}>
          <Link to="/account">
            <ListItemIcon>
              <Fingerprint />
            </ListItemIcon>
          </Link>
          <ListItemText primary="Account" />
        </ListItem>
        <ListItem button key={'settings'}>
          <Link to="/settings">
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
          </Link>
          <ListItemText primary="Settings" />
        </ListItem>
        <Divider /> */}
      </List>
    );
  }
}

export default withAuth(PrimaryMenu);

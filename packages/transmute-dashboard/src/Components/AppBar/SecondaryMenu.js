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

class SecondaryMenu extends Component {
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
        <ListItem button>
          <ListItemIcon>
            <HelpOutline />
          </ListItemIcon>
          <ListItemText primary="Support" />
        </ListItem>

        <ListItem button>
          <ListItemIcon>
            <BugReport />
          </ListItemIcon>
          <ListItemText primary="Bug Report" />
        </ListItem>

        <ListItem button>
          <ListItemIcon>
            <Code />
          </ListItemIcon>
          <ListItemText primary="Github" />
        </ListItem>
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
  connect(mapStateToProps, mapDispatchToProps)(SecondaryMenu)
);

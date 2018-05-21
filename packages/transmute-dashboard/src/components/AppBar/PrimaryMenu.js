import React, { Component } from 'react';

import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

import { withAuth } from '@okta/okta-react';

import {  Dashboard } from 'material-ui-icons';

import { history } from '../../store';

import { EventStoreFactory } from 'transmute-framework';

let eventStoreFactoryArtifact = require('../../contracts/EventStoreFactory.json');

let transmuteConfig = require('../../transmute-config');

class PrimaryMenu extends Component {
  render() {
    return (
      <List>
        <ListItem
          button
          key={'home'}
          onClick={async () => {
            const eventStoreFactory = new EventStoreFactory({
              eventStoreFactoryArtifact,
              ...transmuteConfig
            });
            await eventStoreFactory.init();
            let address =
              eventStoreFactory.eventStoreFactoryContractInstance.address;
            history.push('/eventstorefactory/' + address);
          }}
        >
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
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

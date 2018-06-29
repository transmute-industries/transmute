import React, { Component } from 'react';

import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

import { withAuth } from '@okta/okta-react';

import { Dashboard, AccountCircle, ImportContacts, Chat } from 'material-ui-icons';

import { history } from '../../store';

import { EventStoreFactory } from 'transmute-framework';

let eventStoreFactoryArtifact = require('../../contracts/EventStoreFactory.json');

let transmuteConfig = require('../../transmute-config');

class UserMenu extends Component {
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
        
        <ListItem
          button
          onClick={() => history.push('/profile')}
        >
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>

        <ListItem
          button
          onClick={() => history.push('/directory')}
        >
          <ListItemIcon>
            <ImportContacts />
          </ListItemIcon>
          <ListItemText primary="Directory" />
        </ListItem>

        <ListItem
          button
          onClick={() => history.push('/messages')}
        >
          <ListItemIcon>
            <Chat />
          </ListItemIcon>
          <ListItemText primary="Message" />
        </ListItem>
      </List>
    );
  }
}

export default withAuth(UserMenu);

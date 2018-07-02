import React, { Component } from 'react';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

import { Group } from 'material-ui-icons';

import { history } from '../../store';

class AdminMenu extends Component {
  render() {
    return (
      <List>
        <ListItem
          button
          onClick={() => history.push('/groups')}
        >
          <ListItemIcon>
            <Group />
          </ListItemIcon>
          <ListItemText primary="Groups" />
        </ListItem>
      </List>
    );
  }
}

export default AdminMenu;

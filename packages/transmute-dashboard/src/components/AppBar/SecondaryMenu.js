import React, { Component } from 'react';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

import { Send, BugReport, Code } from 'material-ui-icons';

class SecondaryMenu extends Component {

  render() {
    return (
      <List>
        <ListItem
          button
          onClick={() => {
            window.location.href =
              'https://t.me/joinchat/ICVkOE_WTmzbGmtdl-5d8A';
          }}
        >
          <ListItemIcon>
            <Send />
          </ListItemIcon>
          <ListItemText primary="Telegram" />
        </ListItem>

        <ListItem
          button
          onClick={() => {
            window.location.href =
              'https://transmute-industries.slack.com/join/shared_invite/enQtMzE1MDYwNTQ4MDAzLTFhNGQ1OWVhYzEwMGQ3YTVkOTVmMDk1NDY1NGNmZGMwMmMyMjE5YTZlMjE2NzE1ZTYwYTEyNzU5MjgxM2RiYzE';
          }}
        >
          <ListItemIcon>
            <Send />
          </ListItemIcon>
          <ListItemText primary="Slack" />
        </ListItem>


        <ListItem
          button
          onClick={() => {
            window.location.href =
              'https://github.com/transmute-industries/transmute/issues';
          }}
        >
          <ListItemIcon>
            <BugReport />
          </ListItemIcon>
          <ListItemText primary="Bug Report" />
        </ListItem>

        <ListItem
          button
          onClick={() => {
            window.location.href =
              'https://github.com/transmute-industries/transmute';
          }}
        >
          <ListItemIcon>
            <Code />
          </ListItemIcon>
          <ListItemText primary="Github" />
        </ListItem>
      </List>
    );
  }
}

export default SecondaryMenu;

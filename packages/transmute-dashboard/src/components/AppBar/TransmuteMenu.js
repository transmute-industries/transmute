import React, { Component } from 'react';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

import { Send, BugReport, Code, Games } from 'material-ui-icons';

import { history } from '../../store';

import { EventStoreFactory } from 'transmute-framework';

import eventStoreFactoryArtifact from '../../contracts/EventStoreFactory.json';

let transmuteConfig = require('../../transmute-config');

class TransmuteMenu extends Component {
  async componentWillMount() {
    const eventStoreFactory = new EventStoreFactory({
      eventStoreFactoryArtifact,
      ...transmuteConfig
    });
    await eventStoreFactory.init();
    this.setState({
      factoryAddress:
        eventStoreFactory.eventStoreFactoryContractInstance.address
    });
  }
  render() {
    return (
      <List>
        <ListItem button onClick={() => history.push('/metamask')}>
          <ListItemIcon>
            <Code />
          </ListItemIcon>
          <ListItemText primary="Fund MetaMask" />
        </ListItem>

        <ListItem
          button
          onClick={() =>
            history.push('/eventstorefactory/' + this.state.factoryAddress)
          }
        >
          <ListItemIcon>
            <Games />
          </ListItemIcon>
          <ListItemText primary="EventStore" />
        </ListItem>

        <ListItem button onClick={() => history.push('/demo')}>
          <ListItemIcon>
            <Code />
          </ListItemIcon>
          <ListItemText primary="E-Signer Demo" />
        </ListItem>

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
              'https://join.slack.com/t/transmute-industries/shared_invite/enQtMzkwOTA0MzU3Mzk3LTMyYTk2NmFkY2I2OTNkNjNiMzZjNTFmY2U0OWM0NDlmZjI4Y2YyNTIzMDhmNDYyNzRkYTJmMGUyNTY4MDg1M2U';
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

export default TransmuteMenu;

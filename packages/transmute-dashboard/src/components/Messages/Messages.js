import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from '../AppBar';

import IPFS from 'ipfs';
import Room from 'ipfs-pubsub-room';
import _ from 'lodash';

import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent, CardHeader } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import { LinearProgress } from 'material-ui/Progress';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import List, { ListItem, ListItemText } from 'material-ui/List';

import theme from '../../theme';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  }
});

const ipfsOptions = {
  EXPERIMENTAL: {
    pubsub: true
  },
  config: {
    Addresses: {
      Swarm: [
        "/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star"
      ]
    }
  }
};

class Messages extends Component {
  constructor(props) {
    super(props);
    this.ipfs = new IPFS(ipfsOptions);
    this.state = {
      info: null,
      address: '',
      message: '',
      messages: [],
      selectedPeer: '',
      peers: []
    }

    this.handleMessage = this.handleMessage.bind(this);
    this.handleBroadcast = this.handleBroadcast.bind(this);
    this.selectPeer = this.selectPeer.bind(this);
  }

  componentWillMount() {
    this.ipfs.once('ready', () => this.ipfs.id((err, info) => {
      if (err) { throw err }
      this.setState({ info });

      this.room = Room(this.ipfs, 'ipfs-pubsub-demo');
      this.room.on('peer joined', (peer) => {
        // Notify Peer has Joined
        console.log(peer + ' has joined');
        this.room.sendTo(peer, 'Hello ' + peer + '!');

        // Update Peers
        let updatedPeers = this.state.peers;
        updatedPeers.push(peer);
        this.setState({ peers: _.uniq(updatedPeers) });
        if (this.state.peers.length === 1) {
          this.setState({ selectedPeer: peer });
        }
      });

      this.room.on('peer left', (peer) => {
        // Notify Peer has Left
        console.log(peer + ' has left');
      });
      this.room.on('message', (message) => {
        // Update Messages
        let updatedMessages = this.state.messages;
        updatedMessages.push(message);
        this.setState({ messages: _.uniq(updatedMessages) });
      });
    }))
  }

  handleMessage = event => {
    this.room.sendTo(this.state.selectedPeer, this.state.message);
  }

  handleBroadcast = event => {
    this.room.broadcast(this.state.message);
  }

  selectPeer = event => {
    this.setState({
      selectedPeer: event.target.value
    });
  };

  render() {
    const { classes } = this.props;
    const { info, message, messages, selectedPeer, peers } = this.state;

    return (
      <AppBar>
        {info != null ?
          <Grid container alignItems={'center'} justify={'center'} spacing={24} style={{ padding: 24 }}>
            <Grid item xs={8}>
              <Card>
                <CardHeader title="My Information" />
                <CardContent>
                  <FormControl fullWidth style={{ marginBottom: '16px' }}>
                    <InputLabel htmlFor="id">ID</InputLabel>
                    <Input id="id" value={info.id} />
                  </FormControl>
                  <FormControl fullWidth style={{ marginBottom: '16px' }}>
                    <InputLabel htmlFor="publicKey">Public Key</InputLabel>
                    <Input id="publicKey" multiline value={info.publicKey} />
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
            {messages.length > 0 &&
              <Grid item xs={8}>
                <Card>
                  <CardHeader title="Messages" />
                  <CardContent>
                    <List dense={false} style={{ padding: 0 }}>
                      {messages.map(message => (
                        <ListItem
                          key={messages.indexOf(message)}
                          divider
                          disableGutters
                        >
                          <ListItemText
                            primary={message.from}
                            secondary={message.data.toString()}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            }
            <Grid item xs={8}>
              <Card>
                <CardHeader title="Compose Message" />
                <CardContent>
                  {peers.length > 0 &&
                    <FormControl fullWidth style={{ marginBottom: '16px' }}>
                      <Select
                        native
                        onChange={this.selectPeer}
                        input={<Input id="uncontrolled-native" />}
                      >
                        {peers.map(peer => (
                          <option
                            key={peer}
                            value={peer}
                            style={{
                              fontWeight:
                                selectedPeer !== peer
                                  ? theme.typography.fontWeightRegular
                                  : theme.typography.fontWeightMedium
                            }}
                          >
                            {peer}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  }
                  <FormControl fullWidth style={{ marginBottom: '16px' }}>
                    <InputLabel htmlFor="message">My Message</InputLabel>
                    <Input id="message" multiline={true} value={message} onChange={(e) => this.setState({ message: e.target.value })} />
                  </FormControl>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" disabled={peers.length === 0 || selectedPeer === '' || message.trim().length === 0} onClick={(e) => this.handleMessage(e)}>
                    Send Message
                  </Button>
                  <Button size="small" color="primary" disabled={peers.length === 0 || message.trim().length === 0} onClick={(e) => this.handleBroadcast(e)}>
                    Send Broadcast
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid> :
          <LinearProgress />
        }
      </AppBar>
    );
  }
}

Messages.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Messages);

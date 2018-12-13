import React, { Component } from 'react';
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

import { withAuth } from '@okta/okta-react';
import config from '../../ipfs_pubsub_config';

import theme from '../../theme';
import stringify from 'json-stringify-deterministic';
const openpgp = require('openpgp');

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  }
});

class Messages extends Component {
  constructor(props) {
    super(props);
    this.ipfs = new IPFS(config);
    this.state = {
      info: null,
      address: '',
      message: '',
      messages: [],
      selectedPeer: {},
      peers: {}
    }

    this.handleMessage = this.handleMessage.bind(this);
    this.handleBroadcast = this.handleBroadcast.bind(this);
    this.selectPeer = this.selectPeer.bind(this);
    this.isIntroductoryMessage = this.isIntroductoryMessage.bind(this);
    this.updatePeerStatus = this.updatePeerStatus.bind(this);
  }

  async componentWillMount() {
    const user = await this.props.auth.getUser();
    this.ipfs.once('ready', () => this.ipfs.id((err, info) => {
      if (err) { throw err }
      this.setState({ info });
      
      const secPub = openpgp.key.readArmored(JSON.parse(user.did_document).publicKey[0].publicKeyPem).keys[0];
      const publicKey = Buffer.from(secPub.primaryKey.params[1].data).toString('hex');
      
      const currentPeerInfo = {
        id: info.id,
        pk: publicKey,
        online: true
      };

      this.room = Room(this.ipfs, 'transmute-pubsub-demo');

      this.room.on('peer joined', (peer) => {
        // Send introductory message to peer
        this.room.sendTo(peer, stringify(currentPeerInfo));
      });

      this.room.on('peer left', (peer) => {
        this.updatePeerStatus(peer, false);
      });

      this.room.on('message', (message) => {
        // Check if this is an introductory message
        if (this.isIntroductoryMessage(message.data.toString())) {
          // Check if peer is already known
          if (_.includes(_.keys(this.state.peers), message.from)) {
            // Known peer, update online status
            this.updatePeerStatus(message.from, true);
          } else {
            // Unknown peer, update peers map
            let newPeer = JSON.parse(message.data.toString());
            let updatedPeers = this.state.peers;
            updatedPeers[message.from] = newPeer;
            this.setState({ peers: updatedPeers });
            if (_.keys(this.state.peers).length === 1) {
              this.setState({ selectedPeer: newPeer });
            }
          }
        } else {
          // We don't want to broadcast to ourself
          if (message.from !== info.id) {
            // Update Messages
            let updatedMessages = this.state.messages;
            updatedMessages.push(message);
            this.setState({ messages: _.uniq(updatedMessages) });
          }
        }
      });
    }))
  }

  handleMessage = event => {
    this.room.sendTo(this.state.selectedPeer.id, this.state.message);
  }

  handleBroadcast = event => {
    this.room.broadcast(this.state.message);
  }

  selectPeer = event => {
    this.setState({
      selectedPeer: event.target.value
    });
  };

  updatePeerStatus = (peer, status) => {
    let updatedPeers = this.state.peers;
    let updatedPeer = updatedPeers[peer];
    // Update peer's online status
    updatedPeer.online = status;
    updatedPeers[peer] = updatedPeer;
    this.setState({ peers: updatedPeers });
  };

  isIntroductoryMessage = msg => {
    try {
      let parsedMsg = JSON.parse(msg);
      return _.difference(['pk', 'id', 'online'], _.keys(parsedMsg)).length === 0
    } catch (e) {
      return false;
    }
  }

  render() {
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
                            primary={peers[message.from].pk}
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
                  {_.keys(peers).length > 0 &&
                    <FormControl fullWidth style={{ marginBottom: '16px' }}>
                      <Select
                        native
                        onChange={this.selectPeer}
                        input={<Input id="uncontrolled-native" />}
                      >
                      {_.map(peers, (peer, id) => (
                          <option
                            key={id}
                            value={peer.pk}
                            style={{
                              fontWeight:
                                selectedPeer.id !== peer.id
                                  ? theme.typography.fontWeightRegular
                                  : theme.typography.fontWeightMedium
                            }}
                          >
                            {`${peer.pk} (${peer.online ? 'Online' : 'Offline'})`}
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
                  <Button size="small" color="primary" disabled={_.keys(peers).length === 0 || selectedPeer === null || !selectedPeer.online || message.trim().length === 0} onClick={(e) => this.handleMessage(e)}>
                    Send Message
                  </Button>
                  <Button size="small" color="primary" disabled={_.keys(peers).length === 0 || message.trim().length === 0} onClick={(e) => this.handleBroadcast(e)}>
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

export default withStyles(styles)(withAuth(Messages));

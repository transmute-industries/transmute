import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withAuth } from '@okta/okta-react';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import Grid from 'material-ui/Grid';

import {
  EventStoreFactory,
  EventStore,
  StreamModel
} from 'transmute-framework';

import AppBar from '../AppBar';
import ProfileCard from './ProfileCard';
import DocumentsList from './DocumentsList';
import EventsTable from './DemoEventsTable';
import theme from '../../theme';

import { filters } from '../../filters/Events';
import EventsReducer from '../../store/documents/reducer';
import * as actionsCreators from '../../store/transmute/user/actionCreators';

let eventStoreFactoryArtifact = require('../../contracts/EventStoreFactory.json');
let eventStoreArtifact = require('../../contracts/EventStore.json');
let transmuteConfig = require('../../transmute-config');

const styles = theme => ({
  spacer: {
    flex: '1 1 100%',
    height: 20
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  }
});

const eventStoreFactory = new EventStoreFactory({
  eventStoreFactoryArtifact,
  ...transmuteConfig
});

class Demo extends Component {
  state = {
    eventStoreFactory: null,
    eventStore: null,
    events: [],
    loading: true
  };

  async componentWillMount() {
    await this.init();
  }
  async init() {
    await eventStoreFactory.init();
    const accounts = await eventStoreFactory.getWeb3Accounts();
    let eventStoreAddresses = await eventStoreFactory.getEventStores();

    if (eventStoreAddresses.length === 0) {
      await eventStoreFactory.createEventStore(accounts[0]);
    }

    let currentEventStoreAddress = eventStoreAddresses[0];
    let currentUserAddress = accounts[0];

    const eventStore = new EventStore({
      eventStoreArtifact,
      ...transmuteConfig
    });

    await this.setState({
      eventStoreFactory,
      eventStore,
      accounts,
      eventStoreAddresses,
      currentUserAddress,
      currentEventStoreAddress
    });

    await this.update();
  }

  async update() {
    let { eventStore, currentEventStoreAddress, currentUserAddress } = this.state;
    eventStore.eventStoreContractInstance = await eventStore.eventStoreContract.at(
      currentEventStoreAddress
    );

    let totalCount = (await eventStore.eventStoreContractInstance.count.call()).toNumber();

    let events = [];
    if (totalCount) {
      events = await eventStore.getSlice(0, totalCount - 1);

      events = events.map(event => {
        return {
          ...event,
          id: event.index
        };
      });
    }

    const filter = filters('none');

    const streamModel = new StreamModel(
      eventStore,
      filter,
      EventsReducer,
      null
    );
    streamModel.applyEvents(events);
    let signature = null,
      account = currentUserAddress;
    _.forOwn(streamModel.state.model.signatures, function (value, key) {
      if (key === account) {
        signature = value.hash;
      }
    });

    await this.setState({
      events,
      documents: streamModel.state.model.documents || [],
      signature,
      loading: false
    })
  }

  onUploadDocument = event => {
    this.onUploadFile(event, 'DOCUMENT');
  };

  onUploadSignature = event => {
    this.onUploadFile(event, 'SIGNATURE');
  };

  onUploadFile = (event, type) => {
    event.stopPropagation();
    event.preventDefault();
    this.setState({
      loading: true
    });
    const file = event.target.files[0];
    const filename = event.target.value.split(/(\\|\/)/g).pop();
    let reader = new window.FileReader();
    reader.onloadend = () => this.writeFileFromReader(reader, filename, type);
    reader.readAsArrayBuffer(file);
  };

  writeFileFromReader = (reader, filename, type) => {
    const buffer = Buffer.from(reader.result);
    let { eventStore } = this.state;
    eventStore.ipfs.ipfs
      .add(buffer, { progress: prog => console.log(`received: ${prog}`) })
      .then(response => {
        this.onSaveDocument(response[0].hash, filename, type).then(res =>
          console.log('file uploaded')
        );
        console.log(
          'https://ipfs.infura.io/api/v0/cat?arg=' + response[0].hash
        );
      })
      .catch(err => {
        console.error(err);
        this.setState({
          loading: false
        });
      });
  };

  onSaveDocument = async (fileHash, filename, eventType) => {
    let { eventStore } = this.state;
    if (eventType === 'DOCUMENT') {
      await eventStore.write(
        this.state.currentUserAddress,
        { type: 'document', id: fileHash },
        { type: 'DOCUMENT_CREATED', hash: fileHash, name: filename }
      );
    } else if (eventType === 'SIGNATURE') {
      await eventStore.write(
        this.state.currentUserAddress,
        { type: 'user', id: this.state.currentUserAddress },
        { type: 'SIGNATURE_CREATED', hash: fileHash, name: filename }
      );
    }
    await this.init();
  };

  onSignDocument = async documentHash => {
    let { eventStore } = this.state;
    await this.setState({
      loading: true
    });
    await eventStore.write(
      this.state.currentUserAddress,
      { type: 'document', id: documentHash },
      { type: 'DOCUMENT_SIGNED', hash: this.state.signature }
    );
    await this.init();
  };

  onResetDemo = async event => {
    window.location.reload();
  };

  selectAccount = async event => {
    await this.setState({
      loading: true,
      currentUserAddress: event.target.value
    });
    await this.update();
  };

  selectEventStore = async event => {
    await this.setState({
      loading: true,
      currentEventStoreAddress: event.target.value
    });
    await this.update();
  };

  render() {
    const { classes } = this.props;
    const { events, documents, user, signature, currentUserAddress, currentEventStoreAddress, eventStoreAddresses, accounts, account, loading } = this.state;
    if (!eventStoreAddresses || !accounts) return null;

    return (
      <AppBar loading={loading}>
        <div>
          <Grid container style={{ marginBottom: '20px' }}>
            <Grid item xs={12}>
              <h2>E-Signer Demo</h2>
              <h3>Documents and signatures with Ethereum and IPFS.</h3>
            </Grid>
            <Grid item xs={5}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="uncontrolled-native">
                  EventStore
                </InputLabel>
                <Select
                  value={currentEventStoreAddress}
                  native
                  onChange={this.selectEventStore}
                  input={<Input id="uncontrolled-native" />}
                >
                  {eventStoreAddresses.map(eventStore => (
                    <option
                      key={eventStore}
                      value={eventStore}
                      style={{
                        fontWeight:
                          currentEventStoreAddress !== eventStore
                            ? theme.typography.fontWeightRegular
                            : theme.typography.fontWeightMedium
                      }}
                    >
                      {eventStore}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={5}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="uncontrolled-native">Account</InputLabel>
                <Select
                  value={account}
                  native
                  onChange={this.selectAccount}
                  input={<Input id="uncontrolled-native" />}
                >
                  {accounts.map(account => (
                    <option
                      key={account}
                      value={account}
                      style={{
                        fontWeight:
                          currentUserAddress !== account
                            ? theme.typography.fontWeightRegular
                            : theme.typography.fontWeightMedium
                      }}
                    >
                      {account}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={2}>
              <Button
                color="secondary"
                variant="raised"
                onClick={() => this.onResetDemo()}
              >
                Reset Demo
              </Button>
            </Grid>
          </Grid>
        </div>
        <ProfileCard
          user={user}
          signature={signature}
          onSignatureUpload={this.onUploadSignature}
        />
        <div className={classes.spacer} />

        <DocumentsList
          documents={documents}
          signature={signature}
          onDocumentUpload={this.onUploadDocument}
          onDocumentSign={this.onSignDocument}
        />
        <EventsTable events={events} currentUserAddress={currentUserAddress} />
        <div className={classes.spacer} />
        <div className={classes.spacer} />
      </AppBar>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // go: (somePath) => dispatch(push(somePath)),
    setWeb3Account: async web3Account => {
      dispatch(actionsCreators.setWeb3Account(web3Account));
    }
  };
};
export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(withAuth(Demo))
);

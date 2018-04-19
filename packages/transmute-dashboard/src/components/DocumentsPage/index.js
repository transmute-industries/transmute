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
} from 'transmute-eventstore';

import AppBar from '../AppBar';
import ProfileCard from './ProfileCard';
import DocumentsList from './DocumentsList';
import EventsTable from '../EventStorePage/EventsTable';
import theme from '../../theme';

import { reducer as EventsReducer } from '../../store/documents/reducer';
import { filters } from '../../filters/Events';
import * as actionsCreators from '../../store/user/actionCreators';

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

class DocumentsPage extends Component {
  state = {
    eventStoreFactory: null,
    eventStore: null,
    events: [],
    loading: true
  };

  createStreamModel = async () => {
    const maybeAddress = window.location.pathname.split('/')[2];
    const accessToken = (await this.props.auth.getAccessToken()) || '';
    transmuteConfig.ipfsConfig.authorization = 'Bearer ' + accessToken;

    const eventStoreFactory = new EventStoreFactory({
      eventStoreFactoryArtifact,
      ...transmuteConfig
    });

    await eventStoreFactory.init();

    const eventStore = new EventStore({
      eventStoreArtifact,
      ...transmuteConfig
    });

    eventStore.eventStoreContractInstance = await eventStore.eventStoreContract.at(
      maybeAddress
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
      account = this.props.user.web3Account;
    _.forOwn(streamModel.state.model.signatures, function(value, key) {
      if (key === account) {
        signature = value.hash;
      }
    });

    const accounts = await eventStoreFactory.getWeb3Accounts();

    this.setState({
      eventStoreFactory,
      eventStore,
      events,
      accounts,
      documents: streamModel.state.model.documents || [],
      user: await this.props.auth.getUser(),
      signature,
      loading: false
    });
  };

  async componentWillMount() {
    await this.createStreamModel();
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
    const file = event.target.files[0];
    const filename = event.target.value.split(/(\\|\/)/g).pop();
    let reader = new window.FileReader();
    reader.onloadend = () => this.writeFileFromReader(reader, filename, type);
    reader.readAsArrayBuffer(file);
  };

  writeFileFromReader = (reader, filename, type) => {
    let ipfsId;
    const buffer = Buffer.from(reader.result);
    let { eventStore } = this.state;
    eventStore.ipfs.ipfs
      .add(buffer, { progress: prog => console.log(`received: ${prog}`) })
      .then(response => {
        this.onSaveDocument(response[0].hash, filename, type).then(res =>
          console.log('file uploaded')
        );
        console.log(
          'https://ipfs.transmute.network/api/v0/cat?arg=' + response[0].hash
        );
      })
      .catch(err => {
        console.error(err);
      });
  };

  onSaveDocument = async (fileHash, filename, eventType) => {
    let { eventStore } = this.state;

    if (eventType === 'DOCUMENT') {
      await eventStore.write(
        this.props.user.web3Account,
        { type: 'document', id: fileHash },
        { type: 'DOCUMENT_CREATED', hash: fileHash, name: filename }
      );
    } else if (eventType === 'SIGNATURE') {
      await eventStore.write(
        this.props.user.web3Account,
        { type: 'user', id: this.props.user.web3Account },
        { type: 'SIGNATURE_CREATED', hash: fileHash, name: filename }
      );
    }
    await this.createStreamModel();
  };

  onSignDocument = async documentHash => {
    let { eventStore } = this.state;
    let result = await eventStore.write(
      this.props.user.web3Account,
      { type: 'document', id: documentHash },
      { type: 'DOCUMENT_SIGNED', hash: this.state.signature }
    );
    await this.createStreamModel();
  };

  onResetDemo = async event => {
    let { eventStoreFactory } = this.state;
    await eventStoreFactory.createEventStore(this.props.user.web3Account);
    let eventStoreAddresses = await eventStoreFactory.getEventStores();
    let lastItem = eventStoreAddresses.pop();
    this.props.history.push('/eventstore/' + lastItem + '/documents');
    window.location.reload();
  };

  selectAccount = async (event) => {
    this.setState({ account: event.target.value });
    await this.props.setWeb3Account(event.target.value);
    // window.location.reload();
    await this.createStreamModel();
  };

  render() {
    const { classes } = this.props;
    const { events, documents, user, signature } = this.state;
    if (this.state.loading) return null;

    return (
      <AppBar>
        <div>
          <Grid container style={{marginBottom: '20px'}}>
            <Grid item xs={6}>
              <Button
                color="secondary"
                variant="raised"
                onClick={() => this.onResetDemo()}
              >
                Reset Demo
              </Button>
            </Grid>
            <Grid item xs={6}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="uncontrolled-native">Account</InputLabel>
                <Select
                  value={this.state.account}
                  native
                  defaultValue={30}
                  onChange={this.selectAccount}
                  input={<Input id="uncontrolled-native" />}
                >
                  {this.state.accounts.map(account => (
                    <option
                      key={account}
                      value={account}
                      style={{
                        fontWeight:
                          this.props.user.web3Account.indexOf(account) === -1
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
        <EventsTable events={events} />
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
  connect(mapStateToProps, mapDispatchToProps)(withAuth(DocumentsPage))
);

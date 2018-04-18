import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import _ from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import Button from 'material-ui/Button';

import { StreamModel, EventStore } from 'transmute-eventstore';

import AppBar from '../AppBar';

import { reducer as EventsReducer } from '../../store/documents/reducer';
import { filters } from '../../filters/Events';

let eventStoreArtifact = require('../../contracts/EventStore.json');
let transmuteConfig = require('../../transmute-config');

const styles = theme => ({
  image: {
    maxWidth: '400px',
  }
});

class SignaturePage extends Component {
  state = {
    accounts: null,
    eventStore: null,
    events: [],
    loading: true
  };

  createStreamModel = async () => {
    const maybeAddress = window.location.pathname.split('/')[2];
    const accessToken = (await this.props.auth.getAccessToken()) || '';
    transmuteConfig.ipfsConfig.authorization = 'Bearer ' + accessToken;

    const eventStore = new EventStore({
      eventStoreArtifact,
      ...transmuteConfig
    });

    eventStore.eventStoreContractInstance = await eventStore.eventStoreContract.at(
      maybeAddress
    );

    let totalCount = (await eventStore.eventStoreContractInstance.count.call()).toNumber();

    const accounts = await eventStore.getWeb3Accounts();

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

    const url = new URL(window.location.href);
    const filter = filters('none');

    const streamModel = new StreamModel(eventStore, filter, EventsReducer, null);
    streamModel.applyEvents(events);

    this.setState({
      accounts,
      eventStore,
      events,
      streamModel: streamModel.state.model,
      loading: false
    });
  };

  async componentWillMount() {
    await this.createStreamModel();
  }

  onSaveSignature = async (signatureHash, filename) => {
    let { eventStore } = this.state;
    let result = await eventStore.write(
      this.props.user.web3Account,
      { "type": "user", "id": this.props.user.web3Account },
      { "type": "SIGNATURE_CREATED", "hash": signatureHash, "name": filename }
    );
    await this.createStreamModel();
  };

  onUploadSignature = (event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    const filename = event.target.value.split(/(\\|\/)/g).pop()
    let reader = new window.FileReader()
    reader.onloadend = () => this.writeFileFromReader(reader, filename)
    reader.readAsArrayBuffer(file)
  }

  writeFileFromReader = (reader, filename) => {
    let ipfsId
    const buffer = Buffer.from(reader.result)
    let { eventStore } = this.state;
    eventStore.ipfs.ipfs.add(buffer, { progress: (prog) => console.log(`received: ${prog}`) })
      .then(response => {
        this.onSaveSignature(response[0].hash, filename).then(res => console.log('res? ', res));
        console.log("https://ipfs.transmute.network/api/v0/cat?arg=" + response[0].hash)
      }).catch((err) => {
        console.error(err)
      })
  }

  render() {
    const { classes } = this.props;
    if (this.state.loading) return null;
    const signatureUploaded = _.includes(_.keys(this.state.streamModel.signatures), this.props.user.web3Account);
      return (
        <AppBar>
          { signatureUploaded ? 
            <div>
            <h2>My Signature</h2>
            <img
                src={'https://ipfs.transmute.network/api/v0/cat?arg=' + this.state.streamModel.signatures[this.props.user.web3Account].hash}
              alt="My Signature"
              className={classes.image}
            /></div> : <h2>No signatures found for your account, please upload one.</h2>
          }
          <input
            id="file"
            type="file"
            onChange={this.onUploadSignature}
            style={{
              width: 0,
              height: 0,
              opacity: 0,
              overflow: 'hidden',
              position: 'absolute',
              zIndex: 1,
            }}
          />
          <br/>
          <Button component="label" htmlFor="file">
            Upload New Signature
          </Button>
          {signatureUploaded && 
            <Button
              color="secondary"
              href={"/eventstore/" + this.state.eventStore.eventStoreContractInstance.address + "/documents"}
            >
              View Documents
            </Button>
          }
        </AppBar>
      )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default withStyles(styles)(connect(mapStateToProps, null)(withAuth(SignaturePage)));

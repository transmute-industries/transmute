import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';
import _ from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from 'material-ui/Button';

import { StreamModel, EventStore } from 'transmute-eventstore';

import AppBar from '../AppBar';
import theme from '../../theme';

import { reducer as EventsReducer } from '../../store/documents/reducer';
import { filters } from '../../filters/Events';

let eventStoreArtifact = require('../../contracts/EventStore.json');
let transmuteConfig = require('../../transmute-config');

const styles = theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

class DocumentsPage extends Component {
  state = {
    eventStore: null,
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

    const streamModel = new StreamModel(eventStore, filter, EventsReducer, null);
    streamModel.applyEvents(events);
    let signature = null, account = this.props.user.web3Account;
    _.forOwn(streamModel.state.model.signatures, function (value, key) {
      if (key === account) {
        signature = value;
      }
    });

    this.setState({
      eventStore,
      signature,
      signatures: streamModel.state.model.signatures,
      documents: streamModel.state.model.documents,
      loading: false
    });
  };

  async componentWillMount() {
    await this.createStreamModel();
  }

  onSaveDocument = async (documentHash) => {
    let { eventStore } = this.state;
    let result = await eventStore.write(
      this.props.user.web3Account,
      { "type": "document", "id": documentHash },
      { "type": "DOCUMENT_CREATED", "hash": documentHash }
    );
    await this.createStreamModel();
  };

  onSignDocument = async (documentHash) => {
    let { eventStore } = this.state;
    let result = await eventStore.write(
      this.props.user.web3Account,
      { "type": "document", "id": documentHash },
      { "type": "DOCUMENT_SIGNED", "hash": this.state.signature }
    );
    await this.createStreamModel();
  };

  onUploadDocument = (event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    let reader = new window.FileReader()
    reader.onloadend = () => this.writeFileFromReader(reader)
    reader.readAsArrayBuffer(file)
  }

  writeFileFromReader = (reader) => {
    let ipfsId
    const buffer = Buffer.from(reader.result)
    let { eventStore } = this.state;
    eventStore.ipfs.ipfs.add(buffer, { progress: (prog) => console.log(`received: ${prog}`) })
      .then(response => {
        this.onSaveDocument(response[0].hash).then(res => console.log('file uploaded'));
        console.log("api/v0/cat?arg=" + response[0].hash)
      }).catch((err) => {
        console.error(err)
      })
  }

  render() {
    const { classes } = this.props;
    if (this.state.loading) return null;
    return (
      <AppBar>
        <input
          id="file"
          type="file"
          onChange={this.onUploadDocument}
          style={{
            width: 0,
            height: 0,
            opacity: 0,
            overflow: 'hidden',
            position: 'absolute',
            zIndex: 1,
          }}
        />
        <br />
        <Button
          color="secondary"
          variant="raised"
          component="label"
          htmlFor="file"
        >
          Upload New Document
        </Button>
        {_.map(this.state.documents, (key, value) => (
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>{value}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {_.forEach(this.state.documents[value].signatures, (signature) => {
                <Typography>
                  {signature}
                </Typography>
              })}
              <br/>
              {this.state.documents[value].signatures.indexOf(this.state.signature) === -1 && 
                <Button
                  color="secondary"
                  variant="raised"
                  onClick={() => this.onSignDocument(value)}
                >
                  Sign
                </Button>
              }
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
      </AppBar>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default withStyles(styles)(connect(mapStateToProps, null)(withAuth(DocumentsPage)));

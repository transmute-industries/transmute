import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { default as transmuteRedux } from '../../store/transmute';

import brace from 'brace';
import AceEditor from 'react-ace';

import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import 'brace/mode/javascript';
import 'brace/theme/monokai';

import * as stages from './stages';

function onChange(newValue) {
  console.log('change', newValue);
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: `100%`,
    // marginTop: theme.spacing.unit * 3,
    backgroundColor: theme.palette.background.paper
  },
  header: {
    padding: '20px;'
    // textAlign: 'center'
  },
  editor: {
    height: `100%`
  }
});

class Demo extends React.Component {
  state = {
    stage: 'loading',
    editorValue: ``
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  writeToEditor = someString => {
    this.setState({
      editorValue: this.state.editorValue + someString
    });
  };

  startDemo = async () => {
    await stages.startDemo(this.props);
  };

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    if (this.state.stage === 'loading' && nextProps.transmute.accounts) {
      this.props.actions.updateEditor(`
const accounts = ${JSON.stringify(nextProps.transmute.accounts, null, 2)};
// Click Start Demo if you see your address above.

const { 
  relic, // transmute framework wrapper around web3.
  eventStoreAdapter, // middleware that connects smart contracts with event storage backends.
  readModelAdapter  // middleware that provides cachings layer around event sourced objects called read models.
} = window.TT;

// First, we grab the EventStore Contract:
const eventStore = await T.EventStore.At(
  '0x7103Eb3Fe55fB84cACB274854686B503b9f6bC37'
);

// Next, we write some Events:
const inputEvents = [
  {
    type: 'DOCUMENT_CREATED',
    payload: {
      document_name: 'purchase_order_1272',
      multihash: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
      url: 'http://ipfs2.transmute.network:8080/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG'
    },
    meta: {
      adapter: 'I'
    }
  }
];
const outputEvents = await T.Store.writeFSAs(
  eventStore,
  eventStoreAdapter,
  relic.web3,
  accounts[0],
  events
);

// It may take up a minute for your transaction to be confirmed.
// Your event will be shown below...

`);
      this.setState({
        stage: 'loaded'
      });

      // console.log('accounts ', nextProps.transmute.accounts);
    }
  }

  render() {
    const { classes, transmute } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <h1>Welcome to the Transmute Alpha Demo!</h1>

          <h3>
            Save Events to Ethereum and IPFS with the Transmute Framework.
          </h3>

          <Typography>
            🚧  The Transmute Framework is in alpha, we are collecting feedback,
            please consider filling out this survey:
          </Typography>
          <br />
          <br />

          <Button
            variant="raised"
            color="secondary"
            onClick={this.startDemo}
            disabled={transmute.events.length !== 0}
          >
            Start Demo
          </Button>
        </div>

        <AceEditor
          width="100%"
          height="720px"
          className={classes.editor}
          mode="javascript"
          theme="monokai"
          onChange={onChange}
          name="editor"
          setOptions={{
            useWorker: false,
            readOnly: true
          }}
          value={`
// 🦊 Make sure you login to MetaMask. Your account should be shown below:

const startDemo = async () => {
  ${this.props.transmute.editorValue}
}

startDemo();
`}
          editorProps={{ $blockScrolling: true }}
        />
      </div>
    );
  }
}

Demo.propTypes = {
  classes: PropTypes.object.isRequired
};

export const Component = withStyles(styles)(Demo);

const mapStateToProps = (state, ownProps) => {
  return {
    ...state,
    transmute: state.transmute
  };
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(transmuteRedux.actionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);

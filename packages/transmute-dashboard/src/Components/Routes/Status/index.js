import React from 'react';

import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import { default as transmuteRedux } from '../../../store/transmute';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import transmuteConfig from '../../../transmute-config';

// import Web3 from 'web3';

// import { LinearProgress } from 'material-ui/Progress';

import * as T from 'transmute-framework';

class Status extends React.Component {
  async componentWillReceiveProps(nextProps) {
    // if (window.TT) {
    //   // const { relic } = window.TT;
    //   const web3 = transmuteConfig.web3.getWeb3();
    //   const relic = new T.Relic(web3);
    //   let accounts = await relic.getAccounts();
    //   let factory = await T.Factory.create(relic.web3, accounts[0]);
    //   this.props.actions.setWeb3Accounts(accounts);
    //   console.log(factory);
    // }

    const web3 = await transmuteConfig.web3.getWeb3();
    const relic = new T.Relic(web3);

    const accounts = await relic.getAccounts();

    let factory = await T.Factory.create(relic.web3, accounts[0]);
    console.log(factory);
  }
  render() {
    // if (this.props.transmute.accounts === null) {
    //   return <LinearProgress color="secondary" />;
    // }
    return (
      <div className="Status" style={{ height: '100%' }}>
        <pre>
          {JSON.stringify(
            {
              transmuteConfig,
              accounts: this.props.transmute.accounts
            },
            null,
            2
          )}
        </pre>

        <Button
          variant="raised"
          color="secondary"
          onClick={async () => {
            // let accounts = await transmuteConfig.web3.getAccounts();
            let accounts = await window.TT.relic.getAccounts();
            this.props.actions.setWeb3Accounts(accounts);
          }}
        >
          Get Web3 Accounts
        </Button>
        <br />
        <br />
        <Button
          variant="raised"
          color="secondary"
          onClick={async () => {
            const web3 = await transmuteConfig.web3.getWeb3();
            const relic = new T.Relic(web3);
            const accounts = await relic.getAccounts();
            this.props.actions.setWeb3Accounts(accounts);
            let factory = await T.Factory.create(relic.web3, accounts[0]);
            console.log(factory);
          }}
        >
          Create Factory
        </Button>
      </div>
    );
  }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(Status);

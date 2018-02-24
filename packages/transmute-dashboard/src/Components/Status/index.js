import React from 'react';

import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import { default as transmuteRedux } from '../../store/transmute';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// import { LinearProgress } from 'material-ui/Progress';

import * as T from 'transmute-framework';

class Status extends React.Component {
  render() {
    // if (this.props.transmute.accounts === null) {
    //   return <LinearProgress color="secondary" />;
    // }
    return (
      <div className="Status" style={{ height: '100%' }}>
        <pre>
          {JSON.stringify(
            {
              transmuteConfig: {
                // ...window.TT.ipfs.ipfsConfig
              },
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
            const {
              relic,
              accounts,
              eventStoreAdapter,
              readModelAdapter
            } = window.TT;

            this.props.actions.setWeb3Accounts(accounts);
            let factory = await T.Factory.create(relic.web3, accounts[0]);
            // let readModel = await T.Factory.getReadModel(
            //   factory,
            //   eventStoreAdapter,
            //   readModelAdapter,
            //   relic.web3,
            //   accounts[0]
            // );

            // console.log(factory);
          }}
        >
          Smoke Test
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

import React from 'react';

import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import { default as transmuteRedux } from '../../store/transmute';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// import { LinearProgress } from 'material-ui/Progress';

import * as T from 'transmute-framework';

import transmute from '../../store/transmute';

import EventStoreTabs from '../EventStoreTabs';

class Status extends React.Component {
  demo = async () => {
    const { relic, accounts, eventStoreAdapter, readModelAdapter } = window.TT;

    this.props.actions.setWeb3Accounts(accounts);
    const factory = await T.Factory.create(relic.web3, accounts[0]);
    const factoryReadModel = await T.Factory.getReadModel(
      factory,
      eventStoreAdapter,
      readModelAdapter,
      relic.web3,
      accounts[0]
    );
    await factoryReadModel.sync(factory, eventStoreAdapter, relic.web3);

    const eventStore = await T.Factory.createStore(
      factory,
      accounts,
      relic.web3,
      accounts[0]
    );

    await factoryReadModel.sync(factory, eventStoreAdapter, relic.web3);

    this.props.actions.onFactoryReadModelUpdate(factoryReadModel.state);

    const events = [
      {
        type: 'DOCUMENT_CREATED',
        payload: {
          name: 'po.1337',
          multihash: 'QmceFAWK6QbNVLfNZsFmvi7xycFkHMEAeviYuVwT7Q3TLr'
        },
        meta: {
          adapter: 'I'
        }
      },
      {
        type: 'DOCUMENT_SIGNED',
        payload: {
          name: 'Alice',
          signature: '0x...'
        },
        meta: {
          adapter: 'I'
        }
      },
      {
        type: 'DOCUMENT_SIGNED',
        payload: {
          name: 'Bob',
          signature: '0x...'
        },
        meta: {
          adapter: 'I'
        }
      }
    ];

    const writtenEvents = await T.Store.writeFSAs(
      eventStore,
      eventStoreAdapter,
      relic.web3,
      accounts[0],
      events
    );

    this.props.actions.onSaveEvents(writtenEvents)
    const documentContract = {
      readModelStoreKey: `EventStore:${eventStore.address}`,
      readModelType: 'EventStore',
      contractAddress: `${eventStore.address}`,
      lastEvent: null,
      model: {}
    };

    let eventStoreReadModel = new T.ReadModel(
      readModelAdapter,
      transmute.eventStoreReducers.documentReducer,
      documentContract
    );
    await eventStoreReadModel.sync(eventStore, eventStoreAdapter, relic.web3);

    this.props.actions.onEventStoreReadModelUpdate(eventStoreReadModel.state);
  };
  render() {
    // if (this.props.transmute.accounts === null) {
    //   return <LinearProgress color="secondary" />;
    // }
    return (
      <div className="Status" style={{ height: '100%' }}>
        <Button variant="raised" color="secondary" onClick={this.demo}>
          Demo
        </Button>
        <EventStoreTabs transmute={this.props.transmute} />
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

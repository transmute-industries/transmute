import * as T from 'transmute-framework';

import * as actionCreators from './actionCreators';

import transmute from '../../transmute-config';

export default store => {
  setTimeout(async () => {
    let web3;
    let relic;
    let eventStoreAdapter;
    let readModelAdapter;

    try {
      web3 = await transmute.web3.getWeb3();

      store.dispatch(actionCreators.onWeb3ConnectionSuccess());
      relic = new T.Relic(web3);
    } catch (e) {
      console.warn('web3...', e.message);
      store.dispatch(actionCreators.onWeb3ConnectionRefused());
    }

    // try {
    //   eventStoreAdapter = await getEventStoreAdapterAsync();
    //   store.dispatch(actionCreators.onIpfsConnectionSuccess());
    // } catch (e) {
    //   console.error('ipfs...', e);
    //   store.dispatch(actionCreators.onIpfsConnectionRefused());
    // }

    // try {
    //   readModelAdapter = await getReadModelAdapterAsync();
    //   console.log('localstorage....', readModelAdapter);
    // } catch (e) {
    //   console.error('localstorage...', e);
    // }

    let accounts = await web3.eth.getAccounts();

    window.TT = {
      relic,
      accounts
      // eventStoreAdapter,
      // readModelAdapter
    };
  });
};

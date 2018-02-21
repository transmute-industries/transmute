import * as T from 'transmute-framework';

import { getWeb3RpcConnection } from '../../web3';
import * as actionCreators from './actionCreators';

import { getAdapterAsync as getEventStoreAdapter } from './eventStoreAdapter';
import { getAdapterAsync as getReadModelAdapter } from './readModelAdapter';

export default store => {
  setTimeout(async () => {
    let web3;
    let relic;
    let eventStoreAdapter;
    let readModelAdapter;

    try {
      web3 = await getWeb3RpcConnection();
      store.dispatch(actionCreators.onWeb3ConnectionSuccess());
      relic = new T.Relic(web3);
    } catch (e) {
      console.warn('web3...', e.message);
      store.dispatch(actionCreators.onWeb3ConnectionRefused());
    }

    try {
      eventStoreAdapter = await getEventStoreAdapter();
      store.dispatch(actionCreators.onIpfsConnectionSuccess());
    } catch (e) {
      console.error('ipfs...', e);
      store.dispatch(actionCreators.onIpfsConnectionRefused());
    }

    try {
      readModelAdapter = await getReadModelAdapter();
      console.log('localstorage....', readModelAdapter);
    } catch (e) {
      console.error('localstorage...', e);
    }

    window.TT = {
      relic,
      eventStoreAdapter,
      readModelAdapter
    };
  });
};

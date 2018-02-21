import * as T from 'transmute-framework';

import { getWeb3RpcConnection } from '../../web3';
import * as actionCreators from './actionCreators';

import { getAdapterAsync } from './eventStoreAdapter';

window.TT = {};

export default store => {
  setTimeout(async () => {
    let web3;
    let eventStoreAdapter;

    try {
      web3 = await getWeb3RpcConnection();
      store.dispatch(actionCreators.onWeb3ConnectionSuccess());
      window.TT.relic = new T.Relic(web3);
    } catch (e) {
      console.warn('web3...', e.message);
      store.dispatch(actionCreators.onWeb3ConnectionRefused());
    }

    try {
      eventStoreAdapter = await getAdapterAsync();
      store.dispatch(actionCreators.onIpfsConnectionSuccess());
      console.log('after....');
    } catch (e) {
      console.error('ipfs...', e);
      store.dispatch(actionCreators.onIpfsConnectionRefused());
    }
  });
};

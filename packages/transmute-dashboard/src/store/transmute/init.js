
// import { toast } from 'react-toastify';

// import * as actionCreators from './actionCreators';

// import * as T from 'transmute-framework';
// import transmute from './transmute-config';

export default store => {
  setTimeout(async () => {
    console.log('setting up transmute...');
    // let web3;
    // let relic;
    // let eventStoreAdapter;
    // let readModelAdapter;

    // try {
    //   web3 = await transmute.web3.getWeb3();
    //   store.dispatch(actionCreators.onWeb3ConnectionSuccess());
    //   relic = new T.Relic(web3);

    //   const accounts = await relic.getAccounts();

    //   store.dispatch(actionCreators.setWeb3Accounts(accounts));
    //   if (!accounts.length) {
    //     throw new Error('No accounts available.');
    //   }
    //   toast.success('Web3 Connected.');
    // } catch (e) {
    //   console.warn('web3...', e.message);

    //   toast.error('Install and Sign in to MetaMask.');
    //   store.dispatch(actionCreators.onWeb3ConnectionRefused());
    // }

    // try {
    //   eventStoreAdapter = await transmute.getEventStoreAdapterAsync();
    //   store.dispatch(actionCreators.onIpfsConnectionSuccess());
    //   toast.success('IPFS EventStore Adapter Connected.');
    // } catch (e) {
    //   console.error('ipfs...', e);
    //   toast.error('Allow Mixed Content to use our IPFS test server.');
    //   store.dispatch(actionCreators.onIpfsConnectionRefused());
    // }

    // try {
    //   readModelAdapter = await transmute.getReadModelAdapterAsync();
    //   // console.log('localstorage....', readModelAdapter);
    //   toast.success('LocalStorage ReadModel Adapter Connected.');
    // } catch (e) {
    //   console.error('localstorage...', e);
    // }

    // let accounts = await web3.eth.getAccounts();

    // window.TT = {
    //   relic,
    //   accounts,
    //   eventStoreAdapter,
    //   readModelAdapter
    // };

    // console.log(`
    // window.TT = {
    //   relic,
    //   accounts,
    //   eventStoreAdapter,
    //   readModelAdapter
    // };`);
  });
};

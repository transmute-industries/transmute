import { toast } from 'react-toastify';

import { EventStoreFactory } from 'transmute-framework';

import { getIpfsId } from '../transmute/ipfs-helpers/middleware';

let eventStoreFactoryArtifact = require('../../contracts/EventStoreFactory.json');
let transmuteConfig = require('../../transmute-config');

export const getOktaAccessToken = () => {
  let storage = localStorage.getItem('okta-token-storage');
  if (storage) {
    return JSON.parse(storage).accessToken.accessToken;
  }
  return null;
};

export const init = store => {
  setTimeout(async () => {
    console.log('checking transmute services...');
    const eventStoreFactory = new EventStoreFactory({
      eventStoreFactoryArtifact,
      ...transmuteConfig
    });
    try {
      const accounts = await eventStoreFactory.getWeb3Accounts();
      if (!accounts.length) {
        throw new Error('No accounts available.');
      }
      console.log('accounts: ', JSON.stringify(accounts, null, 2));
    } catch (e) {
      console.warn('web3...', e.message);
      toast.error('Unable to connect web3 to an ethereum network.');
    }

    try {
      let { data } = await getIpfsId();
      console.log('ipfs: ', JSON.stringify(data, null, 2));
    } catch (e) {
      console.error('ipfs...', e);
      toast.error('Unable to connect to ipfs.');
    }
  });
};

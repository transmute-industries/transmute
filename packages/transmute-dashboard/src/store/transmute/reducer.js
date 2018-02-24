import * as Constants from './constants';

// import { toast } from 'react-toastify';

const handlers = {
  [Constants.WEB3_CONNECTION_REFUSED]: (state, action) => {
    // toast.error('Web3 Connection Refused');
    return {
      ...state,
      hasWeb3: false
    };
  },
  [Constants.WEB3_CONNECTION_SUCCESS]: (state, action) => {
    // toast.success('Web3 Connected');
    return {
      ...state,
      hasWeb3: true
    };
  },
  [Constants.IPFS_CONNECTION_REFUSED]: (state, action) => {
    // toast.error('IPFS Connection Refused');
    return {
      ...state,
      hasIpfs: false
    };
  },
  [Constants.IPFS_CONNECTION_SUCCESS]: (state, action) => {
    // toast.success('IPFS Connected');
    return {
      ...state,
      hasIpfs: true
    };
  },
  [Constants.WEB3_ACCOUNTS]: (state, action) => {
    return {
      ...state,
      accounts: action.payload.accounts
    };
  },
  [Constants.UPDATE_FACTORY_TOUR]: (state, action) => {
    return {
      ...state,
      factoryTour: {
        ...state.factoryTour,
        ...action.payload
      }
    };
  }
};

export const initialState = {
  hasWeb3: false,
  hasIpfs: false,
  accounts: null,
  factoryTour: {
    activeStep: 2
  }
};

export const reducer = (state = initialState, action) => {
  return handlers[action.type] ? handlers[action.type](state, action) : state;
};

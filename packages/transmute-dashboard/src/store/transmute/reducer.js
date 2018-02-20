import * as Constants from './constants';

const handlers = {
  [Constants.WEB3_CONNECTION_REFUSED]: (state, action) => {
    return {
      ...state,
      hasWeb3: false
    };
  },
  [Constants.WEB3_CONNECTION_SUCCESS]: (state, action) => {
    return {
      ...state,
      hasWeb3: true
    };
  },
  [Constants.IPFS_CONNECTION_REFUSED]: (state, action) => {
    return {
      ...state,
      hasIpfs: false
    };
  },
  [Constants.IPFS_CONNECTION_SUCCESS]: (state, action) => {
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

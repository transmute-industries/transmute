import * as Constants from "./constants";

const handlers = {
  [Constants.SEARCH_UPDATE]: (state, action) => {
    return {
      ...action.payload
    };
  },
  [Constants.SEARCH_SUBMIT]: (state, action) => {
    return {
      ...action.payload
    };
  },
  [Constants.SEARCH_RESULTS]: (state, action) => {
    console.log('results: ', action.payload)
    return {
      ...action.payload,
      // text: ''
    };
  }
};

export const initialState = {
  fetching: true,
  results: {}
};

export const reducer = (state = initialState, action) => {
  return handlers[action.type]
    ? handlers[action.type](state, action)
    : initialState;
};

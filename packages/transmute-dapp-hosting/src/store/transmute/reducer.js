import * as Constants from "./constants";

const handlers = {
  [Constants.TRANSMUTE_INIT]: (state, action) => {
    return {
      ...action.payload,
      initialized: true
    };
  }
};

export const initialState = {
  initialized: false,
};

export const reducer = (state = initialState, action) => {
  return handlers[action.type]
    ? handlers[action.type](state, action)
    : initialState;
};

import * as Constants from "./constants";

const handlers = {
  [Constants.USER_LOGGED_IN]: (state, action) => {
    return {
      ...state,
      user: action.payload.user,
      status: "LOGGED_IN"
    };
  },
  [Constants.USER_LOGGED_OUT]: (state, action) => {
    return {
      ...state,
      user: null,
      status: "LOGGED_OUT"
    };
  },
  [Constants.USER_STATUS_CHANGE]: (state, action) => {
    return {
      ...state,
      status: action.payload.status
    };
  },
  [Constants.USER_DATA_RECEIVED]: (state, action) => {
    return {
      ...state,
      userData: action.payload
    };
  }
};

export const initialState = {
  status: undefined,
  user: null
};

export const reducer = (state = initialState, action) => {
  return handlers[action.type] ? handlers[action.type](state, action) : state;
};

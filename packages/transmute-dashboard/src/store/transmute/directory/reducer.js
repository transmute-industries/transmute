import * as Constants from './constants';

export const initialState = {};

const handlers = {
  [Constants.DIRECTORY_LOADED]: (state, action) => {
    return {
      ...state,
      profiles: action.payload.profiles
    };
  },
  [Constants.DIRECTORY_PROFILE_LOADED]: (state, action) => {
    return {
      ...state,
      profile: action.payload.profile
    };
  }
};

export default (state = initialState, action) => {
  return handlers[action.type] ? handlers[action.type](state, action) : state;
};

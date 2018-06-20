import * as Constants from './constants';

export const initialState = {
  sessionToken: null,
  error: null,
  success: '',
  web3Account: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Constants.REGISTRATION_SUCCESS:
      return {
        ...state,
        registration: action.payload
      };
    case Constants.REGISTRATION_ERROR:
      return Object.assign({}, state, { error: action.payload });
    case Constants.RECOVERY_SUCCESS:
      return {
        ...state,
        recovery: action.payload
      };
    case Constants.RECOVERY_ERROR:
      return Object.assign({}, state, { error: action.payload });
    case Constants.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        sessionToken: action.payload,
        error: null
      });
    case Constants.LOGIN_ERROR:
      return Object.assign({}, state, {
        sessionToken: null,
        error: action.payload
      });
    case Constants.CHANGE_PASSWORD_SUCCESS:
      return Object.assign({}, state, { error: null, success: action.payload });
    case Constants.CHANGE_PASSWORD_ERROR:
      return Object.assign({}, state, { error: action.payload, success: null });
    case Constants.USER_INFO:
      return {
        ...state,
        info: action.payload
      };
    case Constants.SET_WEB3_ACCOUNT:
      return Object.assign({}, state, { web3Account: action.payload });
    case Constants.LOGOUT:
      return Object.assign({}, state, { sessionToken: null, error: null });
    default:
      return state;
  }
};

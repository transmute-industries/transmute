import { Constants } from '../constants'

const initialState = {
  sessionToken: null,
  error: null,
  success: ''
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case Constants.REGISTRATION_SUCCESS:
      return Object.assign({}, state, { error: null });
    case Constants.REGISTRATION_ERROR:
      return Object.assign({}, state, { error: action.payload });
    case Constants.LOGOUT:
      return Object.assign({}, state, { sessionToken: null, error: null });
    case Constants.LOGIN_ERROR:
      return Object.assign({}, state, { sessionToken: null, error: action.payload });
    case Constants.LOGIN_SUCCESS:
      return Object.assign({}, state, { sessionToken: action.payload, error: null });
    case Constants.CHANGE_PASSWORD_SUCCESS:
      return Object.assign({}, state, { error: null, success: action.payload });
    case Constants.CHANGE_PASSWORD_ERROR:
      return Object.assign({}, state, { error: action.payload, success: null });
    default:
      return state;
  }
};

export default login;
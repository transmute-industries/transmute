import * as Constants from './constants';

export const registerSuccess = data => {
  return {
    type: Constants.REGISTRATION_SUCCESS,
    payload: data
  };
};

export const recoveryError = error => {
  return {
    type: Constants.RECOVERY_ERROR,
    payload: error
  };
};

export const recoverySuccess = data => {
  return {
    type: Constants.RECOVERY_SUCCESS,
    payload: data
  };
};

export const registerError = error => {
  return {
    type: Constants.REGISTRATION_ERROR,
    payload: error
  };
};

export const getUserSuccess = data => ({
  type: Constants.GET_USER_SUCCESS,
  payload: data
});

export const getUserError = error => ({
  type: Constants.GET_USER_ERROR,
  payload: error
});

export const loginSuccess = data => ({
  type: Constants.LOGIN_SUCCESS,
  payload: data
});

export const loginError = error => ({
  type: Constants.LOGIN_ERROR,
  payload: error
});

export const setUserProfileSuccess = data => ({
  type: Constants.SET_USER_PROFILE_SUCCESS,
  payload: data
});

export const setUserProfileError = error => ({
  type: Constants.SET_USER_PROFILE_ERROR,
  payload: error
});

export const logout = () => ({
  type: Constants.LOGOUT
});

export const setWeb3Account = web3Account => ({
  type: Constants.SET_WEB3_ACCOUNT,
  payload: web3Account
});

export const changePasswordSuccess = data => ({
  type: Constants.CHANGE_PASSWORD_SUCCESS,
  payload: data
});

export const changePasswordError = error => ({
  type: Constants.CHANGE_PASSWORD_ERROR,
  payload: error
});
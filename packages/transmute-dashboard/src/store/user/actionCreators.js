import * as Constants from './constants';

export const registerSuccess = data => {
  return {
    type: Constants.REGISTRATION_SUCCESS,
    payload: data
  };
};

export const registerError = error => {
  return {
    type: Constants.REGISTRATION_ERROR,
    payload: error
  };
};

export const logout = () => ({
  type: Constants.LOGOUT
});

export const loginError = error => ({
  type: Constants.LOGIN_ERROR,
  payload: error
});

export const setUserInfo = userInfo => ({
  type: Constants.USER_INFO,
  payload: userInfo
});

export const loginSuccess = data => ({
  type: Constants.LOGIN_SUCCESS,
  payload: data
});


export const changePasswordError = error => ({
    type: Constants.CHANGE_PASSWORD_ERROR,
    payload: error
  });
  
  export const changePasswordSuccess = data => ({
    type: Constants.CHANGE_PASSWORD_SUCCESS,
    payload: data
  });
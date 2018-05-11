import * as Constants from './constants';
import axios from 'axios';

import * as actionCreators from './actionCreators';
import * as middleware from './middleware';

export const register = async ({ firstName, lastName, email }) => {
  try {
    let response = await middleware.register({
      firstName,
      lastName,
      email
    });
    return actionCreators.registerSuccess({
      ...response.data
    });
  } catch (e) {
    return actionCreators.registerError({
      ...e
    });
  }
};

export const loginApiCall = (oktaAuth, email, password) => {
  return dispatch => {
    return oktaAuth
      .signIn({
        username: email,
        password: password
      })
      .then(res => {
        console.log(JSON.stringify(res));
        dispatch(actionCreators.loginSuccess(res.sessionToken));
      })
      .catch(err => {
        console.log(err.message + '\n error', err);
        dispatch(actionCreators.loginError(err.message));
      });
  };
};

export const setWeb3Account = (web3Account) => {
  return dispatch => {
    dispatch(actionCreators.setWeb3Account(web3Account));
  };
};

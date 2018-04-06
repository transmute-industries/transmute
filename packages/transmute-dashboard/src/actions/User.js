import { Constants } from '../constants'
import axios from "axios/index";

export const logout = () => ({
  type: Constants.LOGOUT
});

export const loginError = (error) => ({
  type: Constants.LOGIN_ERROR,
  payload: error
});

export const loginSuccess = (data) => ({
  type: Constants.LOGIN_SUCCESS,
  payload: data
});

export const loginApiCall = (oktaAuth, email, password) => {
  return dispatch => {
    return oktaAuth.signIn({
      username: email,
      password: password
    }).then(res => {
      console.log(JSON.stringify(res));
      dispatch(loginSuccess(res.sessionToken))
    }).catch(err => {
      console.log(err.message + '\n error', err);
      dispatch(loginError(err.message));
    });
  };
};

export const changePasswordError = (error) => ({
  type: Constants.CHANGE_PASSWORD_ERROR,
  payload: error
});

export const changePasswordSuccess = (data) => ({
  type: Constants.CHANGE_PASSWORD_SUCCESS,
  payload: data
});

export const changePasswordApiCall = (data) => {
  return dispatch => {

    if (!data.oldPassword || !data.newPassword) {
      dispatch(changePasswordError('New and Old, both password fields are required'));
      setTimeout(() => {
        dispatch(changePasswordError(null));
      }, 3000)
      return;
    } else if (data.oldPassword.length < 8) {
      dispatch(changePasswordError('Old password length must be minimum 8 characters'));
      setTimeout(() => {
        dispatch(changePasswordError(null));
      }, 3000)
      return;
    } else if (data.newPassword.length < 8) {
      dispatch(changePasswordError('New password length must be minimum 8 characters'));
      setTimeout(() => {
        dispatch(changePasswordError(null));
      }, 3000)
      return;
    }

    return axios({
      method: 'post',
      url: '/api/users/change_password',
      data: data,
      config: {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }
    }).then(json => {
      dispatch(changePasswordSuccess("Password Changed"));
      setTimeout(() => {
        dispatch(changePasswordSuccess(null));
      }, 3000)
    }).catch(err => {
      dispatch(changePasswordError(err.message));
      setTimeout(() => {
        dispatch(changePasswordError(null));
      }, 3000)
    });
  };
};
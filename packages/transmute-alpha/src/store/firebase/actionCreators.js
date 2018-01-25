import * as Constants from "./constants";

export const setUserStatus = ({ user, status }) => {
  return {
    type: Constants.USER_STATUS_CHANGE,
    payload: {
      user,
      status
    }
  };
};

export const loginUser = user => {
  return {
    type: Constants.USER_LOGGED_IN,
    payload: {
      user
    }
  };
};

export const logoutUser = () => {
  return {
    type: Constants.USER_LOGGED_OUT
  };
};

export const setUserData = userData => {
  return {
    type: Constants.USER_DATA_RECEIVED,
    payload: userData
  };
};

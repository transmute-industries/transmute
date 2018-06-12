
import * as actionCreators from './actionCreators';
import * as middleware from './middleware';

export const register = async ({ ed25519, secp256k1 }) => {
  try {
    let response = await middleware.register({
      edArmorPub: ed25519,
      secArmorPub: secp256k1
    });
    return actionCreators.registerSuccess({
      ...response.data
    });
  } catch (e) {
    if (e.response && e.response.data) {
      return actionCreators.registerError({
        ...e.response.data
      });
    } else {
      return actionCreators.registerError({
        ...e
      });
    }
  }
};

export const revoke = async ({ ed25519, secp256k1 }) => {
  try {
    let response = await middleware.revoke({
      edRevArmorPub: ed25519,
      secRevArmorPub: secp256k1
    });
    return actionCreators.revocationSuccess({
      ...response.data
    });
  } catch (e) {
    if (e.response && e.response.data) {
      return actionCreators.revocationError({
        ...e.response.data
      });
    } else {
      return actionCreators.revocationError({
        ...e
      });
    }
  }
};

export const recover = async ({ ed25519, secp256k1 }) => {
  try {
    let response = await middleware.recover({
      edRecArmorPub: ed25519,
      secRecArmorPub: secp256k1
    });
    return actionCreators.recoverySuccess({
      ...response.data
    });
  } catch (e) {
    if (e.response && e.response.data) {
      return actionCreators.recoveryError({
        ...e.response.data
      });
    } else {
      return actionCreators.recoveryError({
        ...e
      });
    }
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

export const getUser = async (auth) => {
  try {
    let response = await middleware.getUser(auth);
    return actionCreators.getUserSuccess({
      ...response.data
    });
  } catch (e) {
    return actionCreators.getUserError({
      ...e
    });
  }
};

export const setUserProfile = async (auth, info) => {
  try {
    let response = await middleware.setUserProfile(auth, info);
    return actionCreators.setUserProfileSuccess({
      ...response.data
    });
  } catch (e) {
    return actionCreators.setUserProfileError({
      ...e
    });
  }
};

export const setWeb3Account = (web3Account) => {
  return dispatch => {
    dispatch(actionCreators.setWeb3Account(web3Account));
  };
};

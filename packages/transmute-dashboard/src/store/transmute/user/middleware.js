import axios from 'axios';

const ENVS = {
  LOCAL: 'http://localhost:5000',
  TEST: '???',
  PROD: 'https://transmute-api.herokuapp.com'
};

export const register = async ({ primaryKey, recoveryKey }) => {
  return axios
    .create({
      baseURL: ENVS.PROD,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
    .post('/api/v0/users', {
      primaryKey,
      recoveryKey
    });
};

export const recover = async (auth, { primaryKey, recoveryKey }) => {
  let access_token = await auth.getAccessToken();
  let user = await auth.getUser();
  return axios
    .create({
      baseURL: ENVS.PROD,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': `Bearer ${access_token}`
      }
    })
    .post(`/api/v0/users/${user.sub}/recover`, {
      newPrimaryKey: primaryKey,
      newRecoveryKey: recoveryKey
    });
};

export const getUser = async (auth) => {
  let access_token = await auth.getAccessToken();
  let user = await auth.getUser();
  return axios
    .create({
      baseURL: ENVS.PROD,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': `Bearer ${access_token}`
      }
    })
    .get(`/api/v0/users/${user.sub}`);
};

export const setUserProfile = async (auth, profile) => {
  let access_token = await auth.getAccessToken();
  let user = await auth.getUser();
  return axios
    .create({
      baseURL: ENVS.PROD,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': `Bearer ${access_token}`
      }
    })
    .post(`/api/v0/users/${user.sub}/profile`, {
      firstName: profile.firstName,
      lastName: profile.lastName
    })
    .then(response => {
      return response;
    })
    .catch(error => {
      return error.response;
    });
};
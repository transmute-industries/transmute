import axios from 'axios';

const ENVS = {
  LOCAL: 'http://localhost:5000',
  TEST: '???',
  PROD: 'https://transmute-api.herokuapp.com'
};
export const register = async ({ edArmorPub, secArmorPub }) => {
  return axios
    .create({
      baseURL: ENVS.PROD,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
    .post('/api/v0/users', {
      edArmorPub,
      secArmorPub
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

export const getGroups = async (auth) => {
  let access_token = await auth.getAccessToken();
  return axios
    .create({
      baseURL: ENVS.PROD,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': `Bearer ${access_token}`
      }
    })
    .get(`/api/v0/groups`);
};

export const getGroup = async (auth, groupId) => {
  let access_token = await auth.getAccessToken();
  return axios
    .create({
      baseURL: ENVS.PROD,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': `Bearer ${access_token}`
      }
    })
    .get(`/api/v0/groups/${id}`);
};

export const createGroup = async (auth, profile) => {
  let access_token = await auth.getAccessToken();
  return axios
    .create({
      baseURL: ENVS.PROD,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': `Bearer ${access_token}`
      }
    })
    .post(`/api/v0/groups/`);
};

export const deleteGroup = async (auth, groupId) => {
  let access_token = await auth.getAccessToken();
  return axios
    .create({
      baseURL: ENVS.PROD,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': `Bearer ${access_token}`
      }
    })
    .delete(`/api/v0/groups/${id}`);
};

export const getGroupMembers = async (auth, groupId) => {
  let access_token = await auth.getAccessToken();
  return axios
    .create({
      baseURL: ENVS.PROD,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': `Bearer ${access_token}`
      }
    })
    .get(`/api/v0/groups/${id}/users`);
};

export const addGroupMember = async (auth, groupId, userId) => {
  let access_token = await auth.getAccessToken();
  return axios
    .create({
      baseURL: ENVS.PROD,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': `Bearer ${access_token}`
      }
    })
    .put(`/api/v0/groups/${id}/users/${userId}`);
};

export const removeGroupMember = async (auth, groupId, userId) => {
  let access_token = await auth.getAccessToken();
  return axios
    .create({
      baseURL: ENVS.PROD,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': `Bearer ${access_token}`
      }
    })
    .delete(`/api/v0/groups/${id}/users/${userId}`);
};

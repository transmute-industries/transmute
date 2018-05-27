import axios from 'axios';
import _ from 'lodash';

const ENVS = {
  LOCAL: 'http://localhost:5000',
  TEST: '???',
  PROD: 'https://transmute-api.herokuapp.com'
};

export const getGroups = async auth => {
  let access_token = await auth.getAccessToken();
  let { data } = await axios
    .create({
      baseURL: ENVS.PROD,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    })
    .get(`/api/v0/groups`);
  return data.groups;
};

export const getGroup = async (auth, groupId) => {
  let access_token = await auth.getAccessToken();
  let { data } = await axios
    .create({
      baseURL: ENVS.PROD,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    })
    .get(`/api/v0/groups/${groupId}`);
  return data;
};

export const setGroupProfile = async (auth, groupId, profile) => {
  let access_token = await auth.getAccessToken();
  let { data } = await axios
    .create({
      baseURL: ENVS.PROD,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    })
    .put(`/api/v0/groups/${groupId}`, {
      name: profile.name,
      description: profile.description
    });
  return data;
};

export const createGroup = async (auth, profile) => {
  let access_token = await auth.getAccessToken();
  return axios
    .create({
      baseURL: ENVS.PROD,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    })
    .post(`/api/v0/groups/`, {
      name: profile.name,
      description: profile.description
    });
};

export const deleteGroup = async (auth, groupId) => {
  let access_token = await auth.getAccessToken();
  return axios
    .create({
      baseURL: ENVS.PROD,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    })
    .delete(`/api/v0/groups/${groupId}`);
};

export const getGroupMembers = async (auth, groupId) => {
  let access_token = await auth.getAccessToken();
  let { data } = await axios
    .create({
      baseURL: ENVS.PROD,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    })
    .get(`/api/v0/groups/${groupId}/users`);
  return _.values(data);
};

export const addGroupMember = async (auth, groupId, userId) => {
  let access_token = await auth.getAccessToken();
  return axios
    .create({
      baseURL: ENVS.PROD,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    })
    .put(`/api/v0/groups/${groupId}/users/${userId}`);
};

export const removeGroupMember = async (auth, groupId, userId) => {
  let access_token = await auth.getAccessToken();
  return axios
    .create({
      baseURL: ENVS.PROD,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    })
    .delete(`/api/v0/groups/${groupId}/users/${userId}`);
};

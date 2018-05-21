import axios from 'axios';

import { getOktaAccessToken } from '../helpers';

const ENVS = {
  LOCAL: 'http://localhost:5000',
  TEST: '???',
  PROD: 'https://transmute-api.herokuapp.com'
};

export const getDirectoryProfiles = async () => {
  let access_token = getOktaAccessToken();
  let { data } = await axios
    .create({
      baseURL: ENVS.PROD,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    })
    .get(`/api/v0/profiles`);
  return data.profiles;
};

export const getDirectoryProfile = async (id) => {
  let access_token = getOktaAccessToken();
  let { data } = await axios
    .create({
      baseURL: ENVS.PROD,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    })
    .get(`/api/v0/profiles/${id}`);
  return data.profile;
};

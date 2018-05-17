import axios from 'axios';

const ENVS = {
  LOCAL: 'http://localhost:5000',
  TEST: '???',
  PROD: 'https://transmute-api.herokuapp.com'
};
export const register = async ({ edArmorPub, secArmorPub }) => {
  return axios
    .create({
      baseURL: ENVS.LOCAL,
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
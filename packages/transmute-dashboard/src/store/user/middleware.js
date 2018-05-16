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

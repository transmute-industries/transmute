import axios from 'axios';

export const register = async ({ email, password }) => {
  return axios
    .create({
      baseURL: 'http://localhost:1337'
    })
    .get('/api/v0/register');
};

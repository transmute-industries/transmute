import axios from 'axios';

const ENVS = {
  LOCAL: 'http://localhost:5001',
  TEST: '???',
  PROD: 'https://ipfs.infura.io:5001'
};

export const getIpfsId = async () => {
  return axios
    .create({
      baseURL: ENVS.PROD,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
    .get(`/api/v0/id`);
};

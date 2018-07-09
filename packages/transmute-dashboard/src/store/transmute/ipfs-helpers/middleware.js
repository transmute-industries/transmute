import axios from 'axios';

import transmuteConfig from '../../../transmute-config'

const ENVS = {
  LOCAL: 'http://localhost:5001',
  TEST: `${transmuteConfig.ipfsConfig.protocol}://${transmuteConfig.ipfsConfig.host}:${transmuteConfig.ipfsConfig.port}`,
  PROD: 'https://ipfs.infura.io:5001'
};

export const getIpfsId = async () => {
  return axios
    .create({
      baseURL: ENVS.TEST,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
    .get(`/api/v0/id`);
};

const defaultEnv = require('./env.json');

const TRANSMUTE_ENV = process.env.TRANSMUTE_ENV || 'localhost';

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

let env = defaultEnv[TRANSMUTE_ENV];

env.ipfsConfig = {
  ...env.ipfsConfig,
  authorization: 'Bearer ' + ACCESS_TOKEN
};

module.exports = env;


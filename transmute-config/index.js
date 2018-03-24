const env = require('./env.json');

const TRANSMUTE_ENV = process.env.TRANSMUTE_ENV || 'localhost';

module.exports = env[TRANSMUTE_ENV];

const secrets = require('secrets.js-grempe');

/**
 * shatter a key with shamir secret sharing
 * @function
 * @name shatterKey
 * @param {String} key a hex encoded symmetric key to shatter
 * @param {String} shareNumber number of shares to create
 * @param {String} shareThreshold number of shares needed to recover key
 * @returns {Array} shamir secret shares of the key
 */
const shatterKey = async ({ key, shareNumber, shareThreshold }) => secrets.share(key, shareNumber, shareThreshold);

/**
 * recover a key with shamir secret sharing
 * @function
 * @name recoverKey
 * @param {Array} shares of a key
 * @returns {String} a key recoverd from shares
 */
const recoverKey = async ({ shares }) => secrets.combine(shares);

module.exports = {
  shatterKey,
  recoverKey,
};

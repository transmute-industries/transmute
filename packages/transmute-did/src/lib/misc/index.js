const secrets = require("secrets.js-grempe");

const shatterKey = async ({ key, shareNumber, shareThreshold }) => {
  return secrets.share(key, shareNumber, shareThreshold);
};

const recoverKey = async ({ shares }) => {
  return secrets.combine(shares);
};

module.exports = {
  shatterKey,
  recoverKey
};

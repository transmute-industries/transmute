const { keccak256 } = require('js-sha3');

const openpgpExtensions = require('../openpgpExtensions/did');

const ethereumExtensions = require('../ethereumExtensions');

const publicKeyToDID = (type, publicKey) => {
  switch (type) {
    case 'openpgp':
      return openpgpExtensions.armoredKeytoDID(publicKey);
    case 'ethereum':
      return `did:eth:${ethereumExtensions.publicKeyToAddress(publicKey)}`;
    case 'orbitdb':
      return `did:orbitdb:0x${keccak256(publicKey)}`;
    default:
      throw new Error('Unknown key type');
  }
};

module.exports = {
  publicKeyToDID,
};

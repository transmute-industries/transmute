const bip39 = require('bip39');
const hdkey = require('hdkey');
const ethUtil = require('ethereumjs-util');

/**
 * generate a bip39 mnemonic
 * @function
 * @name generateBIP39Mnemonic
 * @returns {String} a mnemonic for an hd wallet
 */
const generateBIP39Mnemonic = () => bip39.generateMnemonic();

/**
 * genetate a hex encoded keypair from mnemonic and path
 * @function
 * @name mnemonicToKeypair
 * @param {String} mnemonic for hd wallet
 * @param {String} hdPath path to keypair
 * @returns {Object} hex encoded keypair
 */
const mnemonicToKeypair = (mnemonic, hdPath) => {
  const seed = bip39.mnemonicToSeed(mnemonic);
  const root = hdkey.fromMasterSeed(seed);
  //   const masterPrivateKey = root.privateKey.toString('hex');
  //   console.log(root);

  // Note: Treat your root.publicKey as securely as you would treat your
  // masterPrivateKey as you can still generate the addresses without it.

  const addrNode = root.derive(hdPath);

  // eslint-disable-next-line
  const pubKey = ethUtil.privateToPublic(addrNode._privateKey);

  return {
    publicKey: pubKey.toString('hex'),
    privateKey: addrNode._privateKey.toString('hex'),
  };
};

/**
 * convert a public key to an ethereum address
 * @function
 * @name publicKeyToAddress
 * @param {String} pubKey in hex
 * @returns {String} hex encoded checksum valid ethereum address
 */
const publicKeyToAddress = (pubKey) => {
  const addr = ethUtil
    .publicToAddress(Buffer.from(pubKey, 'hex'))
    .toString('hex');
  const address = ethUtil.toChecksumAddress(addr).toLowerCase();
  return address;
};

const sign = async (payload, privateKey) => {
  const message = ethUtil.toBuffer(payload);
  const msgHash = ethUtil.hashPersonalMessage(message);
  const privateKeyBuffer = Buffer.from(privateKey, 'hex');
  const signature = ethUtil.ecsign(msgHash, privateKeyBuffer);
  return signature;
};

const verify = async (payload, signature, publicKey) => {
  const message = ethUtil.toBuffer(payload);
  const msgHash = ethUtil.hashPersonalMessage(message);
  const publicKeyBuffer = Buffer.from(publicKey, 'hex');
  const recoveredPublicKey = ethUtil.ecrecover(msgHash, signature.v, signature.r, signature.s);
  return publicKeyBuffer.equals(recoveredPublicKey);
};

module.exports = {
  generateBIP39Mnemonic,
  mnemonicToKeypair,
  publicKeyToAddress,
  sign,
  verify,
};

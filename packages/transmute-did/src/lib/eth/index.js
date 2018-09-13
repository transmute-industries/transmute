const bip39 = require("bip39");
const hdkey = require("hdkey");
const ethUtil = require("ethereumjs-util");

const generateBIP39Mneumonic = () => bip39.generateMnemonic();

const mneumonicToKeypair = (mnemonic, hdPath) => {
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
    publicKey: pubKey.toString("hex"),
    privateKey: addrNode._privateKey.toString("hex")
  };
};

const publicKeyToAddress = pubKey => {
  const addr = ethUtil
    .publicToAddress(Buffer.from(pubKey, "hex"))
    .toString("hex");
  const address = ethUtil.toChecksumAddress(addr);
  return address;
};

module.exports = {
  generateBIP39Mneumonic,
  mneumonicToKeypair,
  publicKeyToAddress
};

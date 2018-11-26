const EC = require("elliptic").ec;

const ec = new EC("secp256k1");

/**
 * A custom keystore example
 */
class CustomTestKeystore {
  constructor(keypair) {
    this.key = ec.keyPair({
      pub: keypair.publicKey,
      priv: keypair.privateKey,
      privEnc: "hex",
      pubEnc: "hex"
    });
  }

  //   eslint-disable-next-line
  static createKeypairHex() {
    const key = ec.genKeyPair();
    return {
      publicKey: key.getPublic("hex"),
      privateKey: key.getPrivate("hex")
    };
  }

  static createKey() {
    const key = ec.genKeyPair();

    this.key = ec.keyPair({
      pub: key.getPublic("hex"),
      priv: key.getPrivate("hex"),
      privEnc: "hex",
      pubEnc: "hex"
    });

    return this.key;
  }

  getKey() {
    return this.key;
  }

  // TODO: check if this is really in use
  generateKey() {
    return Promise.resolve(this.createKey());
  }
  //   eslint-disable-next-line
  importPublicKey(key) {
    return Promise.resolve(ec.keyFromPublic(key, "hex"));
  }
  //   eslint-disable-next-line
  importPrivateKey(key) {
    return Promise.resolve(ec.keyFromPrivate(key, "hex"));
  }
  //   eslint-disable-next-line
  sign(key, data) {
    const sig = ec.sign(data, key);
    return Promise.resolve(sig.toDER("hex"));
  }
  //   eslint-disable-next-line
  verify(signature, key, data) {
    let res = false;
    res = ec.verify(data, signature, key);
    return Promise.resolve(res);
  }
}

const createKeypair = () => {
  const key = ec.genKeyPair();
  return {
    publicKey: key.getPublic("hex"),
    privateKey: key.getPrivate("hex")
  };
};

const sign = (data, privateKey) => {
  const key = ec.keyFromPrivate(privateKey, "hex");
  return ec.sign(data, key).toDER("hex");
};

const verify = (data, signature, publicKey) => {
  const key = ec.keyFromPublic(publicKey, "hex");
  let res = false;
  res = ec.verify(data, signature, key);
  return res;
};

module.exports = {
  CustomTestKeystore,
  createKeypair,
  sign,
  verify
};

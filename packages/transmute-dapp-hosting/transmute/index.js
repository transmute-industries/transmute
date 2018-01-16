const web3 = require("./web3");
const eventStoreAdapter = require("./eventStoreAdapter");
const readModelAdapter = require("./readModelAdapter");

const T = require("transmute-framework");
const TransmuteCrypto = require("transmute-crypto");

const init = async () => {
  const relic = new T.Relic(web3);
  const accounts = await relic.getAccounts();

  const generateTestWallets = async num => {
    const sodium = await TransmuteCrypto.getSodium();
    let testWallets = [];
    for (let i = 0; i < num; i++) {
      const alice = sodium.crypto_box_keypair();
      const unPrefixedPrivateKeyHexString = sodium.to_hex(alice.privateKey);
      let address = T.Utils.privateKeyHexToAddress(
        "0x" + unPrefixedPrivateKeyHexString
      );
      testWallets.push({
        address: "0x" + sodium.to_hex(address),
        privateKey: "0x" + unPrefixedPrivateKeyHexString
      });
    }
    return testWallets;
  };

  return {
    T,
    relic,
    accounts,
    generateTestWallets,
    eventStoreAdapter,
    readModelAdapter
  };
};

module.exports = {
  init
};

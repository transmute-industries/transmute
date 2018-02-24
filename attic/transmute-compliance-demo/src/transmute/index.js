const Web3 = require("web3");
const ProviderEngine = require("web3-provider-engine");
const RpcSubprovider = require("web3-provider-engine/subproviders/rpc");
const WalletSubprovider = require("web3-provider-engine/subproviders/wallet");

const eventStoreAdapter = require("./eventStoreAdapter");
const readModelAdapter = require("./readModelAdapter");

const T = require("transmute-framework");
const TransmuteCrypto = require("transmute-crypto");

const RPC_HOST = process.env.GANACHE_CLI || "http://testrpc.transmute.network:8545";

// const WalletSubprovider = require("web3-provider-engine/subproviders/wallet");

const engine = new ProviderEngine();

engine.addProvider(
  new RpcSubprovider({
    rpcUrl: RPC_HOST
  })
);

engine.start();

const web3 = new Web3(engine);

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

  const getRelicWalletWithPrivateKey = unPrefixedPrivateKeyHexString => {
    const engine = new ProviderEngine();
    const wallet = TransmuteCrypto.getWalletFromPrivateKey(
      unPrefixedPrivateKeyHexString
    );
    const address = TransmuteCrypto.getDefaultAddressFromWallet(wallet);
    engine.addProvider(new WalletSubprovider(wallet, {}));
    engine.addProvider(
      new RpcSubprovider({
        rpcUrl: RPC_HOST
      })
    );
    engine.start();
    return new T.Relic(new Web3(engine));
  };

  return {
    T,
    relic,
    accounts,
    generateTestWallets,
    getRelicWalletWithPrivateKey,
    eventStoreAdapter,
    readModelAdapter
  };
};

module.exports = {
  init
};

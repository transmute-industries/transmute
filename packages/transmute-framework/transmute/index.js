const Web3 = require('web3');
const ProviderEngine = require('web3-provider-engine');
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc');
const WalletSubprovider = require('web3-provider-engine/subproviders/wallet');

const eventStoreAdapter = require('./eventStoreAdapter');
const readModelAdapter = require('./readModelAdapter');

const T = require('../');
const TransmuteCrypto = require('transmute-crypto');

const transmuteConfig = require('../src/transmute-config.json');

const RPC_HOST = transmuteConfig.minikube.web3.providerUrl;

const engine = new ProviderEngine();
engine.addProvider(
  new RpcSubprovider({
    rpcUrl: RPC_HOST
  })
);
engine.start();
let web3 = new Web3(engine);

const init = async () => {
  // const accounts = await web3.eth.getAccounts();
  // console.log(accounts);
  // const relic = new T.Relic(web3)
  // const accounts2 = await relic.getAccounts();
  // console.log(accounts2);
  // const factory = await T.Factory.create(relic.web3, accounts[0])
  const relic = new T.Relic(web3);
  const accounts = await relic.getAccounts();
  const generateTestWallets = async num => {
    const sodium = await TransmuteCrypto.getSodium();
    let testWallets = [];
    for (let i = 0; i < num; i++) {
      const alice = sodium.crypto_box_keypair();
      const unPrefixedPrivateKeyHexString = sodium.to_hex(alice.privateKey);
      let address = T.Utils.privateKeyHexToAddress('0x' + unPrefixedPrivateKeyHexString);
      testWallets.push({
        address: '0x' + sodium.to_hex(address),
        privateKey: '0x' + unPrefixedPrivateKeyHexString
      });
    }
    return testWallets;
  };

  const getRelicWalletWithPrivateKey = unPrefixedPrivateKeyHexString => {
    const engine = new ProviderEngine();
    const wallet = TransmuteCrypto.getWalletFromPrivateKey(unPrefixedPrivateKeyHexString);
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

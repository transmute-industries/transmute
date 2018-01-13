import { getSetupAsync } from "../__mocks__/setup";

import Web3 from "web3";

const ProviderEngine = require("web3-provider-engine");
const RpcSubprovider = require("web3-provider-engine/subproviders/rpc.js");
const WalletSubprovider = require("web3-provider-engine/subproviders/wallet.js");

import * as TransmuteCrypto from "transmute-crypto";

const RPC_HOST = "http://localhost:8545";

const getAccounts = (web3: any): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((err, accounts) => {
      if (err) {
        reject(err);
      }
      resolve(accounts);
    });
  });
};

/**
 * web3 tests
 */
describe("web3 tests", () => {
  it("vanilla web3 provider", async () => {
    const web3 = new Web3(new Web3.providers.HttpProvider(RPC_HOST));
    let accounts = await getAccounts(web3);
    expect(accounts.length).toBe(10);
  });

  it("supports provider engine default", async () => {
    const engine = new ProviderEngine();
    engine.addProvider(
      new RpcSubprovider({
        rpcUrl: RPC_HOST
      })
    );
    const web3 = new Web3(engine);
    engine.start();
    let accounts = await getAccounts(web3);
    expect(accounts.length).toBe(10);
  });

  it("supports provider engine wallet", async () => {
    const engine = new ProviderEngine();

    let mneumonic = TransmuteCrypto.generateMnemonic();

    let wallet = TransmuteCrypto.getWalletFromMnemonic(mneumonic);
    let address = TransmuteCrypto.getDefaultAddressFromWallet(wallet);

    engine.addProvider(new WalletSubprovider(wallet, {}));

    engine.addProvider(
      new RpcSubprovider({
        rpcUrl: RPC_HOST
      })
    );

    const web3 = new Web3(engine);
    engine.start();

    let accounts = await getAccounts(web3);
    expect(accounts[0]).toBe(address);
  });

  it("supports provider engine wallet from sodium private key", async () => {
    const engine = new ProviderEngine();
    const sodium = await TransmuteCrypto.getSodium();
    const alice = sodium.crypto_box_keypair();
    const unPrefixedPrivateKeyHexString = sodium.to_hex(alice.privateKey);
    const wallet = TransmuteCrypto.getWalletFromPrivateKey(unPrefixedPrivateKeyHexString);
    const address = TransmuteCrypto.getDefaultAddressFromWallet(wallet);
    engine.addProvider(new WalletSubprovider(wallet, {}));

    engine.addProvider(
      new RpcSubprovider({
        rpcUrl: RPC_HOST
      })
    );

    const web3 = new Web3(engine);
    engine.start();

    let accounts = await getAccounts(web3);
    expect(accounts[0]).toBe(address);
  });
});

import * as Web3 from "web3";
import * as util from "ethereumjs-util";
import * as ProviderEngine from "web3-provider-engine";
import * as FetchSubprovider from "web3-provider-engine/subproviders/fetch.js";
import * as HookedWalletProvider from "web3-provider-engine/subproviders/hooked-wallet.js";
import * as WalletSubprovider from "web3-provider-engine/subproviders/wallet.js";

import * as Transaction from "ethereumjs-tx";

import * as bip39 from "bip39";
import * as hdkey from "ethereumjs-wallet/hdkey";

import * as com from "./Common";
import * as _ from "lodash";
import * as Web3Providers from "./Web3Providers";

const walletProviders = {
  wallet: Web3Providers.getWalletProvider,
  hooked: Web3Providers.getHookedWalletProvider
};

const nodeProviders = {
  normal: Web3Providers.getWeb3Provider,
  fetch: Web3Providers.getFetchProvider
} as any;

const RpcUrls = {
  localhost: "http://localhost:8545",
  infura: "https://ropsten.infura.io"
};
const providers = _.concat(nodeProviders, walletProviders);

const validSignatureAssertions = (k: string, address: string, result: any) => {
  switch (k) {
    case "normal":
      expect(result.isPrefixed).toBe(true);
      break;
    case "fetch":
      expect(result.isPrefixed).toBe(true);
      break;
    case "wallet":
      expect(result.isPrefixed).toBe(false);
      break;
    case "hooked":
      expect(result.isPrefixed).toBe(false);
      break;
  }
  const { v, r, s } = util.fromRpcSig(result.signature);
  const pubKey = util.ecrecover(result.messageBuffer, v, r, s);
  const addrBuf = util.pubToAddress(pubKey);
  const addr = util.bufferToHex(addrBuf);
  expect(address === addr).toBe(true);
};

const testSignature = async (k: string, web3: any, address: string) => {
  let result = await com.getMessageSignatureWithMeta(web3, address, "hello");
  validSignatureAssertions(k, address, result);
};

const testProviders = (providers: any, rpcUrl: string) => {
  _.each(providers, (v: any, k: string) => {
    it(k + " returns a recoverable signature", async () => {
      let { web3, address } = await v(rpcUrl);
      await testSignature(k, web3, address);
    });
  });
};

describe("ECRecover https://localhost:8545", () => {
  testProviders(nodeProviders, RpcUrls.localhost);
  testProviders(walletProviders, RpcUrls.localhost);
});

describe("ECRecover https://ropsten.infura.io", () => {
  testProviders(walletProviders, RpcUrls.infura);

  _.each(nodeProviders, (v: any, k: string) => {
    it(k + " throws Cannot sign message with address.", async () => {
      let { web3, address } = await nodeProviders[k](RpcUrls.infura);
      try {
        await testSignature(k, web3, address);
      } catch (e) {
        expect(e.message).toBe(
          "Cannot sign message with address. Consider if this address is a node or wallet address, and how web3 provider engine has been initialized."
        );
      }
    });
  });
});

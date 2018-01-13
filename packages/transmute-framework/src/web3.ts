import { W3 } from "./transmute-framework";
import Web3 from "web3";

const ProviderEngine = require("web3-provider-engine");
const RpcSubprovider = require("web3-provider-engine/subproviders/rpc.js");
const WalletSubprovider = require("web3-provider-engine/subproviders/wallet.js");

export interface ITransmuteWeb3Config {
  providerUrl: string;
  wallet?: any;
}

export const transmuteWeb3 = (config: ITransmuteWeb3Config, experimental = false) => {
  const engine = new ProviderEngine();

  if (config.wallet) {
    engine.addProvider(new WalletSubprovider(config.wallet, {}));
  }

  engine.addProvider(
    new RpcSubprovider({
      rpcUrl: config.providerUrl
    })
  );

  const web3 = new Web3(engine);
  engine.start();

  return web3;
};

import { W3 } from './transmute-framework'

import Web3 from 'web3'

declare var web3: any

export interface ITransmuteWeb3Config {
  providerUrl: string
}

// "web3": "^0.20.2"
export const getStable = (config: ITransmuteWeb3Config) => {
  // let provider: any = new Web3.providers.HttpProvider(config.providerUrl);

  // let w3 = new W3(provider);
  // // w3.defaultAccount = testAccounts[0];
  // W3.Default = w3
  // return w3

  return new W3()
}

// "web3": "^1.0.0-beta.27"
export const getUnstable = (config: ITransmuteWeb3Config) => {
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider)
  } else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider(config.providerUrl))
  }
  return web3
}

export const transmuteWeb3 = (config: ITransmuteWeb3Config, experimental = false) => {
  return experimental ? getUnstable(config) : getStable(config)
}

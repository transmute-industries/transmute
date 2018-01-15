import Web3 from 'web3'

import ProviderEngine from 'web3-provider-engine'
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc'
import WalletSubprovider from 'web3-provider-engine/subproviders/wallet'

export interface ITransmuteWeb3Config {
  providerUrl: string
  wallet?: any
}

export const transmuteWeb3 = (config: ITransmuteWeb3Config) => {
  const engine = new ProviderEngine()

  if (config.wallet) {
    engine.addProvider(new WalletSubprovider(config.wallet, {}))
  }

  engine.addProvider(
    new RpcSubprovider({
      rpcUrl: config.providerUrl
    })
  )

  const web3 = new Web3(engine)
  engine.start()

  return web3

  // return new Web3(new Web3.providers.HttpProvider(config.providerUrl));
}

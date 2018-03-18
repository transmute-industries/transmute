import Web3 from 'web3'

import ProviderEngine from 'web3-provider-engine'
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc'
import WalletSubprovider from 'web3-provider-engine/subproviders/wallet'

const transmuteConfig = require('../transmute-config.json')

const RPC_HOST = transmuteConfig.minikube.web3.providerUrl

const TransmuteCrypto = require('transmute-crypto')

export const getAccounts = (web3: any): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((err, accounts) => {
      if (err) {
        reject(err)
      }
      resolve(accounts)
    })
  })
}

export const getDefaultWeb3 = () => {
  const engine = new ProviderEngine()
  engine.addProvider(
    new RpcSubprovider({
      rpcUrl: RPC_HOST
    })
  )
  engine.start()
  return {
    web3: new Web3(engine)
  }
}

export const getWeb3FromWalletWithMneumonic = () => {
  const engine = new ProviderEngine()
  const mneumonic = TransmuteCrypto.generateMnemonic()
  const wallet = TransmuteCrypto.getWalletFromMnemonic(mneumonic)
  const address = TransmuteCrypto.getDefaultAddressFromWallet(wallet)
  engine.addProvider(new WalletSubprovider(wallet, {}))
  engine.addProvider(
    new RpcSubprovider({
      rpcUrl: RPC_HOST
    })
  )
  engine.start()
  return {
    web3: new Web3(engine),
    address
  }
}

export const getWeb3FromWalletWithPrivateKey = async () => {
  const engine = new ProviderEngine()
  const sodium = await TransmuteCrypto.getSodium()
  const alice = sodium.crypto_box_keypair()
  const unPrefixedPrivateKeyHexString = sodium.to_hex(alice.privateKey)
  const wallet = TransmuteCrypto.getWalletFromPrivateKey(unPrefixedPrivateKeyHexString)
  const address = TransmuteCrypto.getDefaultAddressFromWallet(wallet)
  engine.addProvider(new WalletSubprovider(wallet, {}))

  engine.addProvider(
    new RpcSubprovider({
      rpcUrl: RPC_HOST
    })
  )
  engine.start()
  return {
    web3: new Web3(engine),
    address
  }
}

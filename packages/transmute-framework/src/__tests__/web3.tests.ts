import { getSetupAsync } from '../__mocks__/setup'

import Web3 from 'web3'

const ProviderEngine = require('web3-provider-engine')
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc.js')
const WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js')

import {
  getAccounts,
  getDefaultWeb3,
  getWeb3FromWalletWithMneumonic,
  getWeb3FromWalletWithPrivateKey
} from '../__mocks__/getWeb3'

const transmuteConfig = require('../transmute-config.json')

const RPC_HOST = transmuteConfig.minikube.web3.providerUrl

/**
 * web3 tests
 */
describe('web3 tests', () => {
  it('vanilla web3 provider', async () => {
    const web3 = new Web3(new Web3.providers.HttpProvider(RPC_HOST))
    let accounts = await getAccounts(web3)
    expect(accounts.length).toBe(10)
  })

  it('supports provider engine default', async () => {
    const { web3 } = getDefaultWeb3()
    let accounts = await getAccounts(web3)
    expect(accounts.length).toBe(10)
  })

  it('supports provider engine wallet from menumonic', async () => {
    const { web3, address } = getWeb3FromWalletWithMneumonic()
    let accounts = await getAccounts(web3)
    expect(accounts.length).toBe(1)
    expect(accounts[0]).toBe(web3.utils.toChecksumAddress(address))
  })

  it('supports provider engine wallet from sodium private key', async () => {
    const { web3, address } = await getWeb3FromWalletWithPrivateKey()
    let accounts = await getAccounts(web3)
    expect(accounts.length).toBe(1)
    expect(accounts[0]).toBe(web3.utils.toChecksumAddress(address))
  })
})

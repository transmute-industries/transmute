import { getDefaultRelic } from '../__mocks__/getRelic'

import { W3 } from 'soltsice'

import {
  Relic,
  Utils,
  Factory,
  Store,
  EventStore
} from '../transmute-framework'

const RPC_HOST = 'http://localhost:8545'

import {
  getAccounts,
  getDefaultWeb3,
  getWeb3FromWalletWithPrivateKey
} from '../__mocks__/getWeb3'

/**
 * Relic tests
 */
describe('Relic tests', () => {
  it('stores can be transfered between wallet and node addresses', async () => {
    let data: any = await getDefaultWeb3()
    let defaultWeb3 = data.web3
    let defaultAccounts = await getAccounts(defaultWeb3)
    let defaultRelic = new Relic(defaultWeb3)

    data = await getWeb3FromWalletWithPrivateKey()
    let walletWeb3 = data.web3
    let walletAccounts = await getAccounts(walletWeb3)
    let walletRelic = new Relic(walletWeb3)

    // sending wei
    let txhash = await defaultRelic.sendWei(
      defaultAccounts[0],
      walletAccounts[0],
      150000000000000000
    )
    expect(txhash).toBeDefined()
    txhash = await walletRelic.sendWei(
      walletAccounts[0],
      defaultAccounts[6],
      150000000000000
    )
    expect(txhash).toBeDefined()

    let factory = await Factory.create(defaultRelic.web3, defaultAccounts[0])
    let store = await Factory.createStore(
      factory,
      walletAccounts.concat(defaultAccounts),
      defaultRelic.web3,
      defaultAccounts[0]
    )

    let storeOwner = await store.owner()
    expect(Utils.toChecksumAddress(storeOwner)).toEqual(defaultAccounts[0])
    // console.log(storeOwner)

    await store.transferOwnership(
      walletAccounts[0],
      W3.TX.txParamsDefaultDeploy(storeOwner)
    )
    storeOwner = await store.owner()
    expect(Utils.toChecksumAddress(storeOwner)).toEqual(walletAccounts[0])
    // console.log(storeOwner)

    // IMPORTANT! You must supply web3 here, or you will not be able to unlock signer account.
    let store2 = await EventStore.At(store.address, walletRelic.web3)
    let store2Owner = await store2.owner()
    expect(Utils.toChecksumAddress(storeOwner)).toEqual(
      Utils.toChecksumAddress(store2Owner)
    )

    await store2.transferOwnership(
      defaultAccounts[2],
      W3.TX.txParamsDefaultDeploy(store2Owner)
    )
    store2Owner = await store2.owner()
    expect(Utils.toChecksumAddress(defaultAccounts[2])).toEqual(
      Utils.toChecksumAddress(store2Owner)
    )
  })
})

import { getDefaultRelic } from '../__mocks__/getRelic'
import { Relic, Utils, Factory, Store, W3 } from '../transmute-framework'
import * as TransmuteCrypto from 'transmute-crypto'

const RPC_HOST = 'http://localhost:8545'

const generateTestWallets = async (num: number) => {
  const sodium = await TransmuteCrypto.getSodium()
  let testWallets: any = []
  for (let i = 0; i < num; i++) {
    const alice = sodium.crypto_box_keypair()
    const unPrefixedPrivateKeyHexString = sodium.to_hex(alice.privateKey)
    let address = Utils.privateKeyHexToAddress('0x' + unPrefixedPrivateKeyHexString)
    testWallets.push({
      address: '0x' + sodium.to_hex(address),
      privateKey: '0x' + unPrefixedPrivateKeyHexString
    })
  }
  return testWallets
}

import { getAccounts, getDefaultWeb3, getWeb3FromWalletWithPrivateKey } from '../__mocks__/getWeb3'

/**
 * Relic tests
 */
describe('Relic tests', () => {
  const allWalletBalancesAre = async (relic, testWallets, expectedBalanceWei: number) => {
    for (let i = 0; i < testWallets.length; i++) {
      let bal = await relic.getBalance(testWallets[i].address)
      expect(bal).toBe(expectedBalanceWei)
    }
  }
  const fundWallets = async (relic, defaultAccount, testWallets, amountWei: number) => {
    for (let i = 0; i < testWallets.length; i++) {
      let txhash = await relic.sendWei(defaultAccount, testWallets[i].address, amountWei)
      expect(txhash).toBeDefined()
    }
  }

  it('can easily fund wallet addresses', async () => {
    let relic = getDefaultRelic()
    let defaultAccount = (await relic.getAccounts())[0]
    let testWallets = await generateTestWallets(3)
    await allWalletBalancesAre(relic, testWallets, 0)
    await fundWallets(relic, defaultAccount, testWallets, 150000000000000000)
    await allWalletBalancesAre(relic, testWallets, 150000000000000000)
  })

  it('supports changing web3 providers randomly', async () => {
    let defaultSetup: any = await getDefaultWeb3()
    let defaultRelic = new Relic(defaultSetup.web3)
    let defaultAccounts = await defaultRelic.getAccounts()
    expect(defaultAccounts.length).toBe(10)

    let walletSetup = await getWeb3FromWalletWithPrivateKey()
    let walletRelic = new Relic(walletSetup.web3)
    let walletAccounts = await walletRelic.getAccounts()
    expect(walletAccounts.length).toBe(1)
    expect(walletAccounts[0]).toBe(Utils.toChecksumAddress(walletSetup.address))

    await fundWallets(
      defaultRelic,
      defaultAccounts[0],
      [{ address: walletAccounts[0] }],
      150000000000000000
    )
    await allWalletBalancesAre(defaultRelic, [{ address: walletAccounts[0] }], 150000000000000000)

    let factory = await Factory.create(defaultRelic.web3, defaultAccounts[0])
    let store = await Factory.createStore(
      factory,
      walletAccounts,
      defaultRelic.web3,
      defaultAccounts[0]
    )

    let events = await Store.transferOwnership(store, defaultAccounts[0], walletAccounts[0])
    let storeOwner = Utils.toChecksumAddress(await store.owner())
    expect(storeOwner).toBe(walletAccounts[0])

    let store2 = await Store.get(store.address, walletRelic.web3)
    let store2Owner = Utils.toChecksumAddress(await store2.owner())
    expect(storeOwner).toEqual(store2Owner)

    events = await Store.transferOwnership(store2, store2Owner, defaultAccounts[2])
    store2Owner = Utils.toChecksumAddress(await store2.owner())
    expect(defaultAccounts[2]).toEqual(store2Owner)
  })
})

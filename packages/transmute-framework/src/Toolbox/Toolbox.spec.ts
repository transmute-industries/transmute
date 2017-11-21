'use strict'

import TransmuteFramework from '../transmute-framework'

import { DEVELOPMENT, PRODUCTION } from '../config/transmute'

let contractArtifacts = {
  aca: require('../../build/contracts/RBAC'),
  esa: require('../../build/contracts/RBACEventStore'),
  esfa: require('../../build/contracts/RBACEventStoreFactory'),
}

let injectedConfig = Object.assign(DEVELOPMENT, contractArtifacts)

let T = TransmuteFramework.init(injectedConfig)

const { web3, Toolbox } = T

import { expect, assert } from 'chai'

import * as _ from 'lodash'
import * as util from 'ethereumjs-util'

import * as Com from './ECRecover/Common'

describe('Toolbox', () => {
  let accountAddresses
  let account: string
  let defaultMnemonic = 'shoulder biology glory jacket pony circle nuclear wood arrow erupt stomach sing'

  beforeAll(async () => {
    accountAddresses = await TransmuteFramework.getAccounts()
    account = accountAddresses[0]
  })

  describe('.sign + .recover work', () => {
    it('work as expected', async () => {
      let message = 'hello'
      let signatureWithMeta = await Toolbox.sign(account, message)
      let recoveredAddress = await Toolbox.recover(signatureWithMeta.messageBufferHex, signatureWithMeta.signature)
      expect(signatureWithMeta.address === recoveredAddress)
    })
  })

  describe('.generateMnemonic', () => {
    it('returns bip39 mnemonic', async () => {
      let mnemonic = Toolbox.generateMnemonic()
    })
  })

  describe('.getWalletFromMnemonic', () => {
    it('returns a wallet for bip39 mnemonic', async () => {
      let mnemonic = Toolbox.generateMnemonic()
      let wallet = Toolbox.getWalletFromMnemonic(mnemonic)
    })
  })

  describe('.getDefaultAddressFromWallet', () => {
    it('returns a wallet for bip39 mnemonic', async () => {
      let mnemonic = Toolbox.generateMnemonic()
      let wallet = Toolbox.getWalletFromMnemonic(mnemonic)
      let addr = Toolbox.getDefaultAddressFromWallet(wallet)
    })
  })

  describe('supports light wallet sign/recover', () => {
    it('when initialized with wallet', async () => {
      const mnemonic = 'couch solve unique spirit wine fine occur rhythm foot feature glory away'
      let wallet = Toolbox.getWalletFromMnemonic(defaultMnemonic)
      TransmuteFramework.init({
        ...T.config,
        providerUrl: 'https://ropsten.infura.io',
        wallet: wallet,
      })
      let addr = Toolbox.getDefaultAddressFromWallet(wallet)
      let signatureWithMeta = await Toolbox.sign(addr, 'hello')
      let recoveredAddress = await Toolbox.recover(signatureWithMeta.messageBufferHex, signatureWithMeta.signature)
      assert(recoveredAddress === addr)
    })

    it('when wallet added later...', async () => {
      const { DEVELOPMENT, PRODUCTION } = require('../config/transmute')

      let injectedConfig = Object.assign(DEVELOPMENT, contractArtifacts)

      let T = TransmuteFramework.init(injectedConfig)

      const mnemonic = Toolbox.generateMnemonic()
      let wallet = Toolbox.getWalletFromMnemonic(mnemonic)
      let config = TransmuteFramework.config
      config.wallet = wallet
      TransmuteFramework.init(config)
      let addr = TransmuteFramework.Toolbox.getDefaultAddressFromWallet(wallet)
      let signatureWithMeta = await TransmuteFramework.Toolbox.sign(addr, 'hello')
      let recoveredAddress = await TransmuteFramework.Toolbox.recover(
        signatureWithMeta.messageBufferHex,
        signatureWithMeta.signature
      )
      assert(recoveredAddress === addr)
    })
  })
})

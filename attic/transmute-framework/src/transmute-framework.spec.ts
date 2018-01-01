'use strict'

const contract = require('truffle-contract')

import * as _ from 'lodash'

import TransmuteFramework from './transmute-framework'

const bip39 = require('bip39')
const hdkey = require('ethereumjs-wallet/hdkey')

declare var jest: any

import { DEVELOPMENT, PRODUCTION } from './config/transmute'

let contractArtifacts = {
  aca: require('../build/contracts/RBAC'),
  esa: require('../build/contracts/RBACEventStore'),
  esfa: require('../build/contracts/RBACEventStoreFactory'),
}

const admin = require('firebase-admin')
const firebase = require('firebase')
require('firebase/firestore')

import * as os from 'os'
import * as path from 'path'

describe('TransmuteFramework', () => {
  jest.setTimeout(20 * 1000)

  it('should have a version', async () => {
    expect(TransmuteFramework.version).toBe(require('../package.json').version)
  })

  describe('.init', () => {
    it('should throw an error when called without a config', async () => {
      try {
        TransmuteFramework.init()
      } catch (e) {
        expect(e.message).toBe('.init requires a config object: try TransmuteFramework.init(config)')
      }
    })
    it('should support DEVELOPMENT', async () => {
      let injectedConfig = Object.assign(DEVELOPMENT, contractArtifacts)
      let T = TransmuteFramework.init(injectedConfig)
      // TODO: add tests here...
      expect(TransmuteFramework.EventStore.framework.TransmuteIpfs.config.host === 'localhost').toBe(true)
      let accounts = await T.getAccounts()
      expect(accounts.length).toBe(10)
    })
    it('should support HD Lightwallets in PRODUCTION', async () => {
      const mnemonic = 'couch solve unique spirit wine fine occur rhythm foot feature glory away'
      const hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic))
      // Get the first account using the standard hd path.
      const walletHDPath = "m/44'/60'/0'/0/"
      const wallet = hdwallet.derivePath(walletHDPath + '0').getWallet()
      let injectedConfig = Object.assign(PRODUCTION, contractArtifacts, {
        wallet,
      })
      let T = TransmuteFramework.init(injectedConfig)
      let accounts = await T.getAccounts()
      expect(accounts.length).toBe(1)
    })
    // it('should support firebase client from ~/.transmute', () => {
    //   const firebaseApp = firebase.initializeApp(
    //     require(path.join(os.homedir(), '.transmute/firebase-client-config.json'))
    //   )
    //   let injectedConfig = Object.assign(DEVELOPMENT, contractArtifacts, {
    //     firebaseApp,
    //   })
    //   let T = TransmuteFramework.init(injectedConfig)
    //   // console.log(T.db)
    // })
    // it('should support firebase admin from ~/.transmute', async () => {
    //   let serviceAccount = require(path.join(os.homedir(), '.transmute/firebase-service-account.json'))
    //   admin.initializeApp({
    //     credential: admin.credential.cert(serviceAccount),
    //   })
    //   let injectedConfig = Object.assign(PRODUCTION, contractArtifacts, {
    //     firebaseAdmin: admin,
    //   })
    //   TransmuteFramework.init(injectedConfig)
    // })
  })
})

// 'use strict'

import TransmuteFramework from '../../transmute-framework'

import { DEVELOPMENT, PRODUCTION } from '../../config/transmute'

let contractArtifacts = {
  aca: require('../../../build/contracts/RBAC'),
  esa: require('../../../build/contracts/RBACEventStore'),
  esfa: require('../../../build/contracts/RBACEventStoreFactory'),
}

let injectedConfig = Object.assign(DEVELOPMENT, contractArtifacts)

let T = TransmuteFramework.init(injectedConfig)

const { web3, AccessControlContract, Permissions } = T

declare var jest: any

describe('Permissions', () => {
  let acc

  let factory
  let accountAddresses
  let account
  let fromAddress

  jest.setTimeout(16 * 1000)
  beforeAll(async () => {
    accountAddresses = await TransmuteFramework.getAccounts()
    account = accountAddresses[0]
    fromAddress = account
    acc = await AccessControlContract.deployed()
  })

  describe('.setAddressRole', () => {
    it('owner can make account 1 an admin', async () => {
      let { tx, events } = await Permissions.setAddressRole(acc, fromAddress, accountAddresses[1], 'admin')
      expect(events[0].type === 'AC_ROLE_ASSIGNED')
      expect(events[0].payload[accountAddresses[1]] === 'admin')
      // TODO: add more tests here...
    })
  })

  describe('.setGrant', () => {
    it('owner can grant admin role create:any eventstore', async () => {
      let txWithEvents = await Permissions.setGrant(acc, fromAddress, 'admin', 'eventstore', 'create:any', ['*'])
      // console.log(events)
      expect(txWithEvents.events[0].type === 'AC_GRANT_WRITTEN')
      txWithEvents = await Permissions.setGrant(acc, fromAddress, 'admin', 'eventstore', 'delete:any', ['*'])
      // console.log(events)
      expect(txWithEvents.events[0].type === 'AC_GRANT_WRITTEN')
      // TODO: add more tests here...
    })

    it('owner can grant admin role create:any castle', async () => {
      let { tx, events } = await Permissions.setGrant(acc, fromAddress, 'admin', 'castle', 'create:any', ['*'])
      // console.log(events)
      expect(events[0].type === 'AC_GRANT_WRITTEN')
      // TODO: add more tests here...
      let readModel = await TransmuteFramework.Permissions.getPermissionsReadModel(acc, fromAddress)
      // console.log(readModel)
    })
  })

  describe('.getGrant', () => {
    it('anyone can get a grant', async () => {
      let grant = await Permissions.getGrant(acc, fromAddress, 0)
      // console.log(grant)
      // TODO: add more tests here...
    })
  })

  describe('.canRoleActionResource', () => {
    it('owner can check if role is granted action on resource', async () => {
      let granted = await Permissions.canRoleActionResource(acc, fromAddress, 'admin', 'create:any', 'eventstore')
      // console.log(granted)
      expect(granted)
      // TODO: add more tests here...
    })
  })

  describe('.getPermissionsReadModel', () => {
    it('return grants as object', async () => {
      let readModel = await TransmuteFramework.Permissions.getPermissionsReadModel(acc, fromAddress)
      // console.log(readModel.model)
      // Todo: add tests here...
    })
  })
})

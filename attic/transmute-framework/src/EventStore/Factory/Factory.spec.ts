'use strict'

import TransmuteFramework from '../../transmute-framework'

import { DEVELOPMENT, PRODUCTION } from '../../config/transmute'

let contractArtifacts = {
  aca: require('../../../build/contracts/RBAC'),
  esa: require('../../../build/contracts/RBACEventStore'),
  esfa: require('../../../build/contracts/RBACEventStoreFactory'),
}

let injectedConfig = Object.assign(DEVELOPMENT, contractArtifacts)

let T = TransmuteFramework.init(injectedConfig)

const { web3, EventStoreFactoryContract, Factory } = T

import * as _ from 'lodash'

declare var jest: any

describe('Factory', () => {
  let factory
  let accountAddresses
  let account
  let fromAddress

  beforeAll(async () => {
    factory = await EventStoreFactoryContract.deployed()
    accountAddresses = await TransmuteFramework.getAccounts()
    account = accountAddresses[0]
    fromAddress = account
  })

  describe('.getFactoryReadModel', () => {
    it('return the current state of a factory', async () => {
      jest.setTimeout(30 * 1000)
      let state = await Factory.getFactoryReadModel(factory, fromAddress)
      // console.log(state)
      // Add tests here...
    })
  })

  describe('.createEventStore...', () => {
    it('returns a transaction', async () => {
      let { tx, events } = await Factory.createEventStore(factory, fromAddress)
      // console.log(events)
      expect(tx.tx !== undefined)
    })

    it('returns a ES_CREATED event', async () => {
      let { tx, events } = await Factory.createEventStore(factory, fromAddress)
      expect(events[0].type === 'ES_CREATED')
    })
  })
  describe('.getAllEventStoreContractAddresses...', () => {
    it('should create an event store and return event ', async () => {
      let addresses = await Factory.getAllEventStoreContractAddresses(factory, fromAddress)
    })
  })

  describe('.setAddressRole', () => {
    it('owner can make account 1 an admin', async () => {
      // console.log(factory.setAddressRole)
      let { tx, events } = await Factory.setAddressRole(factory, fromAddress, accountAddresses[1], 'admin')
      expect(events[0].type).toBe('AC_ROLE_ASSIGNED')
      expect(events[0].payload[accountAddresses[1]]).toBe('admin')
      // TODO: add more tests here...
    })
  })

  describe('.setGrant', () => {
    it('owner can grant admin role create:any eventstore', async () => {
      // console.log(factory.setAddressRole)
      let { tx, events } = await Factory.setGrant(factory, fromAddress, 'admin', 'eventstore', 'create:any', ['*'])
      // console.log(events)
      expect(events[0].type).toBe('AC_GRANT_WRITTEN')
      // TODO: add more tests here...
    })
  })

  describe('.canRoleActionResource', () => {
    it('owner can check if role is granted action on resource', async () => {
      // console.log(factory.setAddressRole)
      let granted = await Factory.canRoleActionResource(factory, fromAddress, 'admin', 'create:any', 'eventstore')
      // console.log(granted)
      expect(granted).toBe(true)
      // assert.equal(events[0].type, 'AC_GRANT_WRITTEN', 'expect AC_GRANT_WRITTEN event')
      // TODO: add more tests here...
    })
  })
})

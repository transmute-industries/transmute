'use strict'

import TransmuteFramework from '../../../transmute-framework'

import { DEVELOPMENT, PRODUCTION } from '../../../config/transmute'

let contractArtifacts = {
  aca: require('../../../../build/contracts/RBAC'),
  esa: require('../../../../build/contracts/RBACEventStore'),
  esfa: require('../../../../build/contracts/RBACEventStoreFactory'),
}

let injectedConfig = Object.assign(DEVELOPMENT, contractArtifacts)

let T = TransmuteFramework.init(injectedConfig)

const { web3, EventStoreContract, EventStoreFactoryContract, PatchLogic, EventStore, ReadModel } = T

import { expect, assert } from 'chai'

import * as _ from 'lodash'

import States from './States'
import * as Logic from './Logic'

import moment from 'moment'

import { readModel as patchLogicReadModel, reducer as patchLogicReducer } from './Reducer'

import * as Common from '../../Utils/Common'

describe('PatchLogic', () => {
  let factory, eventStore
  let account_addresses, account, fromAddress

  beforeAll(async () => {
    account_addresses = await TransmuteFramework.getAccounts()
    account = account_addresses[0]
    fromAddress = account

    factory = await EventStoreFactoryContract.deployed()
    let tx = await factory.createEventStore({
      from: fromAddress,
      gas: 4000000,
    })

    let fsa = Common.getFSAFromEventArgs(tx.logs[0].args)
    // console.log(fsa.payload.address)
    eventStore = await EventStoreContract.at(fsa.payload.address)
  })

  describe('.applyJsonLogic', () => {
    it('returns the result of jsonLogic.apply', () => {
      // Here we inject a date and isHeroBirthday property into each event
      // We then use json logic to evaluate a rule on each event
      // This approach is useful for systems where user's design complex rules about state
      let eventsOverTime = _.cloneDeep(States)
      let birthday = States[0].payload.hero.birthday
      let date = moment(birthday, 'YYYY-MM-DD').subtract(2, 'days')
      eventsOverTime.forEach((event: any) => {
        event.payload.date = date.format('YYYY-MM-DD')
        date = date.add(1, 'days')
        event.payload.isHeroBirthday = PatchLogic.applyJsonLogic(Logic.isHeroBirthday, event.payload)
      })
    })
  })

  describe('.applyJsonLogicProjection', () => {
    it('map events to applyJsonLogic(rule, event)', () => {
      let eventsOverTime = _.cloneDeep(States)
      let birthday = States[0].payload.hero.birthday
      let date = moment(birthday, 'YYYY-MM-DD').subtract(2, 'days')
      eventsOverTime.forEach((event: any) => {
        event.payload.date = date.format('YYYY-MM-DD')
        date = date.add(1, 'days')
      })
      let states = eventsOverTime.map(event => {
        return event.payload
      })
      let projection = PatchLogic.applyJsonLogicProjection(Logic.isHeroBirthday, states)
      assert(!projection[1])
      assert(projection[2])
    })
  })

  describe('State Changes as IPLD Patches', () => {
    it('should convert state changes to state patch commands and save them as IPLD to IPFS', async () => {
      let updatedReadModel = _.cloneDeep(patchLogicReadModel)
      for (let i = 0; i < States.length; i++) {
        let next = States[i].payload
        let command = Object.assign({}, States[i], {
          type: 'IPLD_PATCH',
          payload: {
            patch: TransmuteFramework.TransmuteIpfs.diff(updatedReadModel.model, States[i].payload),
            type: 'ipld',
          },
        })
        let event = await EventStore.writeFSA(eventStore, fromAddress, command)
        updatedReadModel = await TransmuteFramework.ReadModel.getCachedReadModel(
          eventStore,
          fromAddress,
          patchLogicReadModel,
          patchLogicReducer
        )
      }
      let model = updatedReadModel.model as any
      assert(model.hero.health === 30)
    })
  })
})

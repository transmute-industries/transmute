'use strict'
import * as _ from 'lodash'
import TransmuteFramework from '../transmute-framework'

import { DEVELOPMENT, PRODUCTION } from '../config/transmute'

let contractArtifacts = {
  aca: require('../../build/contracts/RBAC'),
  esa: require('../../build/contracts/RBACEventStore'),
  esfa: require('../../build/contracts/RBACEventStoreFactory'),
}

let injectedConfig = Object.assign(DEVELOPMENT, contractArtifacts)

let T = TransmuteFramework.init(injectedConfig)

const { web3, EventStoreContract, EventStoreFactoryContract } = T

import { assert, expect, should } from 'chai'

import { fsaCommands } from './EventStore.mock'

import { readModel as permissionsReadModel, reducer as permissionsReducer } from './Permissions/Reducer'

describe('EventStore', () => {
  let factory, eventStore, account_addresses, account, fromAddress

  beforeAll(async () => {
    account_addresses = await TransmuteFramework.getAccounts()
    account = account_addresses[0]
    fromAddress = account
    eventStore = await EventStoreContract.deployed()
    factory = await EventStoreFactoryContract.deployed()
  })

  describe('can write IFSACommand and read IFSAEvent', () => {
    fsaCommands.forEach(fsac => {
      describe(fsac.type, async () => {
        let fn = async () => {
          let eventId
          let shouldThrow
          beforeEach(() => (shouldThrow = 'error' in fsac ? true : false))

          it('.writeFSA ' + (fsac['error'] === undefined ? 'expected error' : ''), () =>
            TransmuteFramework.EventStore
              .writeFSA(eventStore, account, fsac)
              .then(fsaEvent => {
                assert.equal(fsaEvent.type, fsac.type, 'expected types to match')
                eventId = fsaEvent.meta.id
              })
              .catch(error => {
                //    console.log(error)
                if (!shouldThrow) {
                  throw error
                }
              })
          )

          it('.readFSA', () =>
            TransmuteFramework.EventStore
              .readFSA(eventStore, account, eventId)
              .then(fsaEvent => {
                assert.equal(fsaEvent.type, fsac.type, 'expected types to match')
                eventId = fsaEvent.meta.id
              })
              .catch(error => {
                if (!shouldThrow) {
                  throw error
                }
              }))
        }

        // This should be refactored to catch the specific errors thrown in seperate it's
        try {
          if (fsac.hasOwnProperty('error')) {
            await assert.throws(fn)
          } else {
            await fn()
          }
        } catch (e) {
          console.log
        }
      })
    })
  })

  // These need to be rewritten....
  //   describe('.readTransmuteEvents', () => {
  //     let initialEventId, commands, cmdResponses
  //     before(async () => {
  //         initialEventId = (await eventStore.eventCount()).toNumber()
  //         commands = [addressCommand, numberCommand, stringCommand, objectCommand]
  //         cmdResponses = await TransmuteFramework.EventStore.writeTransmuteCommands(eventStore, account_addresses[0], commands)
  //         assert.lengthOf(cmdResponses, commands.length)
  //     })
  //     it('should return all transmute events after and including the given eventId', async () => {
  //         let transmuteEvents = await TransmuteFramework.EventStore.readTransmuteEvents(eventStore, account_addresses[0], initialEventId)
  //         assert.lengthOf(transmuteEvents, commands.length)
  //         // Add more tests here...
  //     })
  // })

  // describe('.writeTransmuteCommands', () => {
  //     it('should write an array of ITransmuteCommands and return and array of ITransmuteCommandResponse', async () => {
  //         let commands = [addressCommand, numberCommand, stringCommand, objectCommand]
  //         let cmdResponses = await TransmuteFramework.EventStore.writeTransmuteCommands(eventStore, account_addresses[0], commands)
  //         assert.lengthOf(cmdResponses, commands.length)
  //         // add more tests here...
  //     })
  // })
})

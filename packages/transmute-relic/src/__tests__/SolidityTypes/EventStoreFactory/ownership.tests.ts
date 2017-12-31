import { W3 } from 'soltsice'
import { EventStoreFactory, EventStore } from '../../../SolidityTypes'
import { getRelic } from '../../../__mocks__/setup'
import { EventTransformer } from '../../../Utils/EventTransformer'
import { IFSA } from '../../../Store/EventTypes'
import Relic from '../../../transmute-relic'

import * as InternalEventTypes from '../../../Utils/InternalEventTypes'

/**
 * EventStoreFactory spec
 */
describe('EventStoreFactory', () => {
  let relic: Relic
  let accounts: string[]
  let factory: EventStoreFactory
  let receipt: any
  let events: IFSA[]

  beforeAll(async () => {
    relic = await getRelic()
    accounts = await relic.getAccounts()
  })

  describe('factory ownership', async () => {
    it('the factory owner is the creator (caller of New)', async () => {
      // create a new factory
      factory = await EventStoreFactory.New(W3.TC.txParamsDefaultDeploy(accounts[0]), {
        _multisig: accounts[0]
      })

      // the factory owner is the factory contract deployer
      let factoryOwner = await factory.owner()
      expect(factoryOwner).toBe(accounts[0])
    })

    it('the factory owner can transferOwnership', async () => {
      // create a new factory
      factory = await EventStoreFactory.New(W3.TC.txParamsDefaultDeploy(accounts[0]), {
        _multisig: accounts[0]
      })

      // the factory owner can transferOwnership
      let receipt = await factory.transferOwnership(
        accounts[1],
        W3.TC.txParamsDefaultDeploy(accounts[0])
      )
      events = EventTransformer.getFSAsFromReceipt(receipt)
      expect(events[0].type).toBe(InternalEventTypes.NEW_OWNER)
      expect(events[0].payload.value).toBe(accounts[1])

      // the event was not a lie
      let factoryOwner = await factory.owner()
      expect(factoryOwner).toBe(accounts[1])
    })
  })
})

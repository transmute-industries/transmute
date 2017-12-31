import { getSetupAsync } from '../../__mocks__/setup'
import { EventStoreFactory } from '../../SolidityTypes/EventStoreFactory'
import { Factory } from '../Factory'

import Relic from '../../transmute-relic'
import { W3 } from 'soltsice'
const Storage = require('node-storage')
import { EventStoreAdapter } from '../../Store/EventStoreAdapter'

/**
 * Factory test
 */
describe('Factory', () => {
  let relic: Relic
  let accounts: string[]
  let factory: EventStoreFactory
  let eventStoreAdapter: EventStoreAdapter

  beforeAll(async () => {
    let setup = await getSetupAsync()
    relic = setup.relic
    factory = setup.factory
    accounts = setup.accounts
    eventStoreAdapter = setup.eventStoreAdapter
  })

  it('can create a factory instance ', async () => {
    expect(factory.address).toBeDefined()
  })

  it('can getEventStores from a factory instance ', async () => {
    let stores = await Factory.getEventStores(factory, accounts[0])
    expect(stores.length).toEqual(1)
  })

  it('can getReadModel from a factory instance ', async () => {
    const db = new Storage('./read_model_storage')

    const readModelAdapter: any = {
      getItem: (id: string) => {
        return JSON.parse(db.get(id))
      },
      setItem: (id: string, value: any) => {
        return db.put(id, JSON.stringify(value))
      }
    }

    let readModel = await Factory.getReadModel(
      factory,
      eventStoreAdapter,
      readModelAdapter,
      relic.web3,
      accounts[0]
    )

    let eventStoreContractAddresses = Object.keys(readModel.state.model)
    expect(eventStoreContractAddresses.length).toBe(1)
  })
})

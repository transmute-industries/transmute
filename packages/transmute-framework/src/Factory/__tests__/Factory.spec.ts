const Storage = require('node-storage')

import { getSetupAsync } from '../../__mocks__/setup'

import {
  Relic,
  EventStoreFactory,
  Factory,
  EventStoreAdapter
} from '../../transmute-framework'
import { W3 } from 'soltsice'
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

    // default factory has an eventstore in its readmodel...
    let readModel = await Factory.getReadModel(
      factory,
      eventStoreAdapter,
      readModelAdapter,
      relic.web3,
      accounts[0]
    )
    let eventStoreContractAddresses = Object.keys(readModel.state.model)
    expect(eventStoreContractAddresses.length).toBe(1)

    // adding a new event store should update the read model
    let eventStore = await Factory.createStore(
      factory,
      accounts,
      relic.web3,
      accounts[0]
    )

    // console.log(eventStoreAdapter.eventMap)
    let changes = await readModel.sync(
      factory as any,
      eventStoreAdapter,
      relic.web3
    )
    // console.log(changes)

    expect(Object.keys(readModel.state.model).length).toBe(2)

    // console.log(readModel.state)
  })
})

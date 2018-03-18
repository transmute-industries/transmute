import { getSetupAsync } from '../../__mocks__/setup'

import { Relic, Store, Factory, PackageService, EventStoreFactory } from '../../transmute-framework'
import { read } from 'fs-extra'

const Storage = require('node-storage')
const db = new Storage('./read_model_storage')

let ipfsAdapter = require('transmute-adapter-ipfs')

const readModelAdapter: any = {
  getItem: (id: string) => {
    return JSON.parse(db.get(id))
  },
  setItem: (id: string, value: any) => {
    return db.put(id, JSON.stringify(value))
  }
}

/**
 * PackageService tests
 */
describe('PackageService tests', () => {
  let setup: any
  let accounts: string[]
  let relic: Relic
  let factory: EventStoreFactory
  let hash1
  let hash2
  beforeAll(async () => {
    setup = await getSetupAsync()
    accounts = setup.accounts
    relic = setup.relic
    factory = setup.factory

    let ipfs = setup.eventStoreAdapter.mapper['I'].db

    hash1 = await ipfsAdapter.setItem(ipfs, {
      package: 1
    })

    hash2 = await ipfsAdapter.setItem(ipfs, {
      package: 2
    })
  })

  // it('is special case of eventstore', async () => {
  //   let store = await Factory.createStore(factory, accounts, relic.web3, accounts[0]);
  //   let ps = new PackageService(relic, store, setup.eventStoreAdapter, readModelAdapter);
  // });

  it('can publish packages', async () => {
    let store = await Factory.createStore(factory, accounts, relic.web3, accounts[0])
    let ps = new PackageService(relic, store, setup.eventStoreAdapter, readModelAdapter)

    let event = await ps.publishPackage(hash1, 'bobo@0.0.1', accounts[0])

    event = await ps.publishPackage(hash2, 'bobo@0.0.2', accounts[0])

    await ps.requireLatestReadModel()

    expect(Object.keys(ps.readModel.state.model).length).toBe(5)
  })

  it('throws error when package already exists.', async () => {
    let store = await Factory.createStore(factory, accounts, relic.web3, accounts[0])
    let ps = new PackageService(relic, store, setup.eventStoreAdapter, readModelAdapter)
    let event = await ps.publishPackage(hash1, 'bobo@0.0.1', accounts[0])
    try {
      event = await ps.publishPackage(hash1, 'bobo@0.0.1', accounts[0])
    } catch (e) {
      expect(e.message).toBe('package already exists in read model.')
    }
  })

  it('can delete packages', async () => {
    let store = await Factory.createStore(factory, accounts, relic.web3, accounts[0])
    let ps = new PackageService(relic, store, setup.eventStoreAdapter, readModelAdapter)
    let event = await ps.publishPackage(hash1, 'bobo@0.0.1', accounts[0])

    event = await ps.publishPackage(hash2, 'bobo@0.0.2', accounts[0])

    event = await ps.deletePackage(hash2, accounts[0])
    expect(Object.keys(ps.readModel.state.model).length).toBe(4)
  })

  it('throws error when deleting a package that does not exist in read model', async () => {
    let store = await Factory.createStore(factory, accounts, relic.web3, accounts[0])
    let ps = new PackageService(relic, store, setup.eventStoreAdapter, readModelAdapter)
    let event = await ps.publishPackage(hash1, 'bobo@0.0.1', accounts[0])
    event = await ps.publishPackage(hash2, 'bobo@0.0.2', accounts[0])
    event = await ps.deletePackage(hash2, accounts[0])
    expect(Object.keys(ps.readModel.state.model).length).toBe(4)
    try {
      event = await ps.deletePackage(hash2, accounts[0])
    } catch (e) {
      expect(e.message).toBe('package does not exist in read model.')
    }
  })

  it('all references and costs are tracked.', async () => {
    let store = await Factory.createStore(factory, accounts, relic.web3, accounts[0])
    let ps = new PackageService(relic, store, setup.eventStoreAdapter, readModelAdapter)
    let event = await ps.publishPackage(hash1, 'bobo@0.0.1', accounts[0])
    event = await ps.publishPackage(hash2, 'bobo@0.0.2', accounts[0])
    let readModel = await ps.getReadModel()
    event = await ps.deletePackage(hash1, accounts[0])
    // console.log(JSON.stringify(ps.readModel.state, null, 2))
    // need tests here...
  })
})

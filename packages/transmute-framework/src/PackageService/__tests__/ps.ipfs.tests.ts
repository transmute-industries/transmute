import { getSetupAsync } from '../../__mocks__/setup'

import { Relic, Store, Factory, PackageService, EventStoreFactory } from '../../transmute-framework'

const Storage = require('node-storage')
const db = new Storage('./read_model_storage')

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

  beforeAll(async () => {
    setup = await getSetupAsync()
    accounts = setup.accounts
    relic = setup.relic
    factory = setup.factory
  })

  it('PackageService is special case of eventstore', async () => {
    console.log('foo', relic)

    let store = await Factory.createStore(factory, accounts, relic.web3, accounts[0])

    // let ps = new PackageService(store, setup.eventStoreAdapter);
  })

  // it('read model can use internal and external events.', async () => {

  //   globalIPFS = setup.eventStoreAdapter.mapper.I.db

  //   let events = await Store.writeFSAs(store, setup.eventStoreAdapter, relic.web3, accounts[0], [
  //     {
  //       type: 'PACKAGE_UPDATED',
  //       payload: {
  //         name: 'bobo',
  //         multihash: 'QmNrEidQrAbxx3FzxNt9E6qjEDZrtvzxUVh47BXm55Zuen',
  //         version: '0.0.1'
  //       },
  //       meta: {
  //         adapter: 'I'
  //       }
  //     },
  //     {
  //       type: 'PACKAGE_UPDATED',
  //       payload: {
  //         name: 'bobo',
  //         multihash: 'QmNrEidQrAbxx3FzxNt9E6qjEDZrtvzxUVh47BXm55Zuen',
  //         version: '0.0.2'
  //       },
  //       meta: {
  //         adapter: 'I'
  //       }
  //     }
  //   ])

  //   let state: IReadModelState = JSON.parse(JSON.stringify(initialState))

  //   state.contractAddress = factory.address
  //   state.readModelStoreKey = `${state.readModelType}:${state.contractAddress}`

  //   let ipfsReadModel = new ReadModel(readModelAdapter, reducer, state)
  //   let changes = await ipfsReadModel.sync(store, setup.eventStoreAdapter, relic.web3)
  //   console.log(JSON.stringify(ipfsReadModel, null, 2))
  // })
})

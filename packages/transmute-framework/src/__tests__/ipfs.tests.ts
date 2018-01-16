import { getSetupAsync } from '../__mocks__/setup'

import {
  Relic,
  Store,
  Factory,
  EventStoreFactory,
  EventStore,
  InternalEventTypes,
  ReadModel,
  IReadModelState
} from '../transmute-framework'

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

let globalIPFS

let getStat = mhash => {
  return new Promise((resolve, reject) => {
    globalIPFS.stat(mhash, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

const initialState = {
  readModelStoreKey: '', // readModelType:contractAddress
  readModelType: 'PackageManager',
  contractAddress: '0x0000000000000000000000000000000000000000',
  lastEvent: null, // Last Event Index Processed
  model: {} // where all the updates from events will be made
}

const updatesFromMeta = (meta: any) => {
  return {
    lastEvent: meta.id
  }
}

const handlers: any = {
  [InternalEventTypes.NEW_OWNER]: (state: any, action: any) => {
    // console.log(action);
    return {
      ...state,
      model: {
        ...state.model,
        owner: action.payload.value
      },
      ...updatesFromMeta(action.meta)
    }
  },
  [InternalEventTypes.WL_SET]: (state: any, action: any) => {
    // console.log(action);
    return {
      ...state,
      model: {
        ...state.model,
        whitelisted: true
      },
      ...updatesFromMeta(action.meta)
    }
  },
  PACKAGE_UPDATED: async (state: any, action: any) => {
    // console.log(action);

    let newState = {
      ...state,
      model: {
        ...state.model,
        [action.payload.name]: {
          ...state.model[action.payload.name],
          version: action.payload.version,
          multihash: action.payload.multihash
        }
      },
      ...updatesFromMeta(action.meta)
    }

    // console.log("in reducer... use stat...", globalIPFS);
    let eventMultihash = action.meta.adapterPayload.value

    console.log(eventMultihash)
    let data = await getStat(eventMultihash)
    console.log(data)

    return newState
  }
}

const reducer = async (state: any, action: any) => {
  if (handlers[action.type]) {
    return await handlers[action.type](state, action)
  }
  return state
}

/**
 * ipfs tests
 */
describe('ipfs tests', () => {
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

  it('read model can use internal and external events.', async () => {
    let store = await Factory.createStore(
      factory,
      accounts,
      setup.eventStoreAdapter,
      relic.web3,
      accounts[0]
    )

    globalIPFS = setup.eventStoreAdapter.mapper.I.db

    let events = await Store.writeFSAs(store, setup.eventStoreAdapter, relic.web3, accounts[0], [
      {
        type: 'PACKAGE_UPDATED',
        payload: {
          name: 'bobo',
          multihash: 'QmNrEidQrAbxx3FzxNt9E6qjEDZrtvzxUVh47BXm55Zuen',
          version: '0.0.1'
        },
        meta: {
          adapter: 'I'
        }
      },
      {
        type: 'PACKAGE_UPDATED',
        payload: {
          name: 'bobo',
          multihash: 'QmNrEidQrAbxx3FzxNt9E6qjEDZrtvzxUVh47BXm55Zuen',
          version: '0.0.2'
        },
        meta: {
          adapter: 'I'
        }
      }
    ])

    let state: IReadModelState = JSON.parse(JSON.stringify(initialState))

    state.contractAddress = factory.address
    state.readModelStoreKey = `${state.readModelType}:${state.contractAddress}`

    let ipfsReadModel = new ReadModel(readModelAdapter, reducer, state)
    let changes = await ipfsReadModel.sync(store, setup.eventStoreAdapter, relic.web3)
    console.log(JSON.stringify(ipfsReadModel, null, 2))
  })
})

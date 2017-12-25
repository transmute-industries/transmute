import { Store } from '../Store'
import { getSetupAsync } from '../__mocks___/store'

let allEvents = [
  {
    type: 'test',
    payload: {
      key: 'value'
    },
    meta: {}
  },
  {
    type: 'test',
    payload: {
      key: 'value',
      key2: 'value2'
    },
    meta: {
      adapter: 'I'
    }
  },
  {
    type: 'test',
    payload: {
      key: 'value',
      key2: 'value2'
    },
    meta: {
      adapter: 'L'
    }
  },
  {
    type: 'test',
    payload: {
      address: '0x01000c268181f5d90587392ff67ada1a16393fe4'
    },
    meta: {}
  },
  {
    type: 'test',
    payload: {
      bytes32: '0x000000000000000000000000000000000000000000000000000000000000000A'
    },
    meta: {}
  },
  {
    type: 'test',
    payload: {
      uint: 0
    },
    meta: {}
  }
]

/**
 * Store adapter tests
 */
describe('Store adapter tests', () => {
  let setup: any

  beforeAll(async () => {
    setup = await getSetupAsync()
  })

  allEvents.forEach(event => {
    it('can read and write event: \n' + JSON.stringify(event, null, 2) + '\n', async () => {
      let { store, adapter, relic, accounts } = setup
      let writtenEvents = await Store.writeFSA(store, adapter, relic.web3, accounts[0], event)
      let readEvents = await Store.readFSA(
        store,
        adapter,
        relic.web3,
        accounts[0],
        writtenEvents[0].meta.id
      )
      expect(writtenEvents[0]).toEqual(readEvents)
    })
  })
})

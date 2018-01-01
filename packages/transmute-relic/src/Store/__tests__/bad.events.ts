import { getSetupAsync } from '../../__mocks__/setup'
import { EventStore } from '../../SolidityTypes/EventStore'
import { Store } from '../Store'

import Relic from '../../transmute-relic'
import { W3 } from 'soltsice'
const Storage = require('node-storage')
import { EventStoreAdapter } from '../../Store/EventStoreAdapter'
import * as EventTransformer from '../../Utils/EventTransformer'

const WRITE_EVENT_GAS_COST = 4000000

import events from '../__mocks__/bad.events'
/**
 * Store test
 */
describe('Store', () => {
  let relic: Relic
  let accounts: string[]
  let store: EventStore
  let eventStoreAdapter: EventStoreAdapter

  beforeAll(async () => {
    let setup = await getSetupAsync()
    relic = setup.relic
    store = setup.store
    accounts = setup.accounts
    eventStoreAdapter = setup.eventStoreAdapter
  })

  it('throws error when eventStoreAdapter not provided for payload meta.eventStoreAdapter', async () => {
    try {
      await Store.writeFSA(store, eventStoreAdapter, relic.web3, accounts[0], {
        type: 'test',
        payload: {
          key: 'value',
          key2: 'value2'
        },
        meta: {
          adapter: 'Q'
        }
      })
    } catch (e) {
      expect(e.message).toBe('mapper not provided for event.meta.adapter: Q')
    }
  })

  it('throws error when invalid payload is string.', async () => {
    try {
      await Store.writeFSA(store, eventStoreAdapter, relic.web3, accounts[0], {
        type: 'test',
        payload: 'INVALID SHAPE',
        meta: {}
      })
    } catch (e) {
      expect(e.message).toBe('event.payload must be an object, not a string.')
    }
  })

  it('throws error when invalid payload is array.', async () => {
    try {
      await Store.writeFSA(store, eventStoreAdapter, relic.web3, accounts[0], {
        type: 'test',
        payload: [1, 2, 3],
        meta: {}
      })
    } catch (e) {
      expect(e.message).toBe('event.payload must be an object, not an array.')
    }
  })

  it('throws error when payload key is to large', async () => {
    try {
      await Store.writeFSA(store, eventStoreAdapter, relic.web3, accounts[0], {
        type: 'test',
        payload: {
          REALLY_LARGE_KEY_BIGGER_THAN_BYTES_32_STRING______________________: 'value'
        },
        meta: {}
      })
    } catch (e) {
      expect(e.message).toBe(
        'fsa.meta.adapter is not defined. be sure to set it when fsa.payload is an object (isAdapterEvent).'
      )
    }
  })

  it('throws error when payload key is address, and value is not valid address', async () => {
    try {
      await Store.writeFSA(store, eventStoreAdapter, relic.web3, accounts[0], {
        type: 'test',
        payload: {
          key: 'address',
          value: 'NOT_AN_ADDRESS'
        },
        meta: {}
      })
    } catch (e) {
      expect(e.message).toBe(
        'payload of address type has none address value. NOT_AN_ADDRESS is not a valid address.'
      )
    }
  })

  it('throws error when payload key is address, and value invalid hex: x1E63f28550ae27e0a192d91d073ea4e97dd089b0', async () => {
    try {
      await Store.writeFSA(store, eventStoreAdapter, relic.web3, accounts[0], {
        type: 'test',
        payload: {
          key: 'address',
          value: 'x1E63f28550ae27e0a192d91d073ea4e97dd089b0'
        },
        meta: {}
      })
    } catch (e) {
      expect(e.message).toBe(
        'payload of address type has none address value. x1E63f28550ae27e0a192d91d073ea4e97dd089b0 is not a valid address.'
      )
    }
  })

  it('throws error when payload key is address, and value invalid hex: 1E63f28550ae27e0a192d91d073ea4e97dd089b0', async () => {
    try {
      await Store.writeFSA(store, eventStoreAdapter, relic.web3, accounts[0], {
        type: 'test',
        payload: {
          key: 'address',
          value: '1E63f28550ae27e0a192d91d073ea4e97dd089b0'
        },
        meta: {}
      })
    } catch (e) {
      expect(e.message).toBe(
        'payload of address type has none address value. 1E63f28550ae27e0a192d91d073ea4e97dd089b0 is not a valid address.'
      )
    }
  })

  it('throws error when payload key is bytes32, and value is larger than bytes32', async () => {
    try {
      await Store.writeFSA(store, eventStoreAdapter, relic.web3, accounts[0], {
        type: 'test',
        payload: {
          key: 'bytes32',
          value: 'REALLY_LARGE_VALUE_BIGGER_THAN_BYTES_32_STRING______________________'
        },
        meta: {}
      })
    } catch (e) {
      expect(e.message).toBe(
        'payload value of type (S) is more than 32 bytes. value length = 68 chars'
      )
    }
  })

  it("throws error when payload key is bytes32, and value is malformed: '0x000000000000000000000000000000000000000000000000000000000000000-'", async () => {
    try {
      await Store.writeFSA(store, eventStoreAdapter, relic.web3, accounts[0], {
        type: 'test',
        payload: {
          key: 'bytes32',
          value: '0x000000000000000000000000000000000000000000000000000000000000000-'
        },
        meta: {}
      })
    } catch (e) {
      expect(e.message).toBe(
        'payload value of type (S) is more than 32 bytes. value length = 66 chars'
      )
    }
  })

  it('throws error when payload key is bytes32, and value is malformed...: 000000000000000000000000000000000000000000000000000000000000000A', async () => {
    try {
      await Store.writeFSA(store, eventStoreAdapter, relic.web3, accounts[0], {
        type: 'test',
        payload: {
          key: 'bytes32',
          value: '000000000000000000000000000000000000000000000000000000000000000A'
        },
        meta: {}
      })
    } catch (e) {
      expect(e.message).toBe(
        'payload value of type (S) is more than 32 bytes. value length = 64 chars'
      )
    }
  })

  it('throws error when payload.type is to big', async () => {
    try {
      await Store.writeFSA(store, eventStoreAdapter, relic.web3, accounts[0], {
        type: 'REALLY_LARGE_VALUE_BIGGER_THAN_BYTES_32_STRING______________________',
        payload: {
          key: 'bytes32',
          value: '000000000000000000000000000000000000000000000000000000000000000A'
        },
        meta: {}
      })
    } catch (e) {
      expect(e.message).toBe('fsa.type (S) is more than 32 bytes. value length = 68 chars')
    }
  })
})

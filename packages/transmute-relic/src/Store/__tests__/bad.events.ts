import { Store } from '../Store'
import { getSetupAsync } from '../__mocks___/store'

/**
 * Store errors for bad events
 */
describe('Store errors for bad events', () => {
  let setup: any

  beforeAll(async () => {
    setup = await getSetupAsync()
  })

  it('throws error when adapter not provided for payload meta.adapter', async () => {
    let { store, adapter, relic, accounts } = setup
    try {
      await Store.writeFSA(store, adapter, relic.web3, accounts[0], {
        type: 'test',
        payload: {
          key: 'value',
          key2: 'value2'
        },
        meta: {
          adapter: 'I'
        }
      })
    } catch (e) {
      expect(e.message).toBe('adapterMap not provided for event.meta.adapter: I')
    }
  })

  it('throws error when invalid payload is string.', async () => {
    let { store, adapter, relic, accounts } = setup
    try {
      await Store.writeFSA(store, adapter, relic.web3, accounts[0], {
        type: 'test',
        payload: 'INVALID SHAPE',
        meta: {}
      })
    } catch (e) {
      expect(e.message).toBe('event.payload must be an object, not a string.')
    }
  })

  it('throws error when invalid payload is array.', async () => {
    let { store, adapter, relic, accounts } = setup
    try {
      await Store.writeFSA(store, adapter, relic.web3, accounts[0], {
        type: 'test',
        payload: [1, 2, 3],
        meta: {}
      })
    } catch (e) {
      expect(e.message).toBe('event.payload must be an object, not an array.')
    }
  })

  it('throws error when payload key is to large', async () => {
    let { store, adapter, relic, accounts } = setup
    try {
      await Store.writeFSA(store, adapter, relic.web3, accounts[0], {
        type: 'test',
        payload: {
          REALLY_LARGE_KEY_BIGGER_THAN_BYTES_32_STRING______________________: 'value'
        },
        meta: {}
      })
    } catch (e) {
      expect(e.message).toBe('payload key to large. does not fit in bytes32 string (S).')
    }
  })

  it('throws error when payload key is address, and value is not valid address', async () => {
    let { store, adapter, relic, accounts } = setup
    try {
      await Store.writeFSA(store, adapter, relic.web3, accounts[0], {
        type: 'test',
        payload: {
          address: 'NOT_AN_ADDRESS'
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
    let { store, adapter, relic, accounts } = setup
    try {
      await Store.writeFSA(store, adapter, relic.web3, accounts[0], {
        type: 'test',
        payload: {
          address: 'x1E63f28550ae27e0a192d91d073ea4e97dd089b0'
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
    let { store, adapter, relic, accounts } = setup
    try {
      await Store.writeFSA(store, adapter, relic.web3, accounts[0], {
        type: 'test',
        payload: {
          address: '1E63f28550ae27e0a192d91d073ea4e97dd089b0'
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
    let { store, adapter, relic, accounts } = setup
    try {
      await Store.writeFSA(store, adapter, relic.web3, accounts[0], {
        type: 'test',
        payload: {
          bytes32: 'REALLY_LARGE_VALUE_BIGGER_THAN_BYTES_32_STRING______________________'
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
    let { store, adapter, relic, accounts } = setup
    try {
      await Store.writeFSA(store, adapter, relic.web3, accounts[0], {
        type: 'test',
        payload: {
          bytes32: '0x000000000000000000000000000000000000000000000000000000000000000-'
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
    let { store, adapter, relic, accounts } = setup
    try {
      await Store.writeFSA(store, adapter, relic.web3, accounts[0], {
        type: 'test',
        payload: {
          bytes32: '000000000000000000000000000000000000000000000000000000000000000A'
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
    let { store, adapter, relic, accounts } = setup
    try {
      await Store.writeFSA(store, adapter, relic.web3, accounts[0], {
        type: 'REALLY_LARGE_VALUE_BIGGER_THAN_BYTES_32_STRING______________________',
        payload: {
          bytes32: '000000000000000000000000000000000000000000000000000000000000000A'
        },
        meta: {}
      })
    } catch (e) {
      expect(e.message).toBe('fsa.type (S) is more than 32 bytes. value length = 68 chars')
    }
  })

  it('supports well formated address payloads', async () => {
    let { store, adapter, relic, accounts } = setup
    let events = await Store.writeFSA(store, adapter, relic.web3, accounts[0], {
      type: 'test',
      payload: {
        address: '0x1e63f28550ae27e0a192d91d073ea4e97dd089b0'
      },
      meta: {}
    })
    expect(events[0].payload.address === '0x1e63f28550ae27e0a192d91d073ea4e97dd089b0')
  })

  it('supports well formated bytes payloads', async () => {
    let { store, adapter, relic, accounts } = setup
    let events = await Store.writeFSA(store, adapter, relic.web3, accounts[0], {
      type: 'test',
      payload: {
        bytes32: '0x000000000000000000000000000000000000000000000000000000000000000A'
      },
      meta: {}
    })
    expect(
      events[0].payload.bytes32 ===
        '0x000000000000000000000000000000000000000000000000000000000000000A'
    )
  })
})

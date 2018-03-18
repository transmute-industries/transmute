const bs58 = require('bs58')
import { EventStoreAdapter } from '../../../transmute-framework'

const transmuteConfig = require('../../../transmute-config.json')

const ipfsConfig = {
  ...transmuteConfig.minikube.ipfs.config
  // host: 'localhost',
  // port: 5001,
  // protocol: 'http'
}

/**
 * Good EventStoreAdapter tests
 */
describe('Good adapter tests', () => {
  let storeTypeAdapter: EventStoreAdapter

  beforeAll(async () => {
    let ipfsAdapter = require('../../../../../transmute-adapter-ipfs')
    let ipfs = ipfsAdapter.getStorage({
      ...ipfsConfig
    })
    storeTypeAdapter = new EventStoreAdapter({
      I: {
        keyName: 'multihash',
        adapter: ipfsAdapter,
        db: ipfs,
        readIDFromBytes32: (bytes32: string) => {
          return bs58.encode(new Buffer('1220' + bytes32.slice(2), 'hex'))
        },
        writeIDToBytes32: (id: string) => {
          return '0x' + new Buffer(bs58.decode(id).slice(2)).toString('hex')
        }
      }
    })
  })

  // uses event.meta.adapter to transform event.payload
  it('convertFSAPayload ', async () => {
    let adapterFSAEvent = {
      type: 'test',
      payload: {
        key1: 'multihash',
        value2: '0x01000c268181f5d90587392ff67ada1a16393fe4',
        value3: null
      },
      meta: {
        adapter: 'I'
      }
    }
    let converted = await storeTypeAdapter.convertFSAPayload(adapterFSAEvent)
  })

  it('supports ipfs ', async () => {
    let ipfsAdapter = require('../../../../../transmute-adapter-ipfs')
    let ipfs = ipfsAdapter.getStorage(ipfsConfig)

    let storeTypeAdapter = new EventStoreAdapter({
      I: {
        keyName: 'multihash',
        adapter: ipfsAdapter,
        db: ipfs,
        readIDFromBytes32: (bytes32: string) => {
          return bs58.encode(new Buffer('1220' + bytes32.slice(2), 'hex'))
        },
        writeIDToBytes32: (id: string) => {
          return '0x' + new Buffer(bs58.decode(id).slice(2)).toString('hex')
        }
      }
    })
    let payload = {
      multihash: 'QmcEMXuJYiyDQpbU1BaFQngaBajPEs9UUHuQnPUYSLWa1B'
    }
    let encodedId = storeTypeAdapter.mapper['I'].writeIDToBytes32(payload.multihash)
    let decodedId = storeTypeAdapter.mapper['I'].readIDFromBytes32(encodedId)
    expect(payload.multihash).toBe(decodedId)
  })
})

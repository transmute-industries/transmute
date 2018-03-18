import { getDefaultRelic } from './getRelic'

import { W3 } from 'soltsice'

import {
  Relic,
  TransmuteContracts,
  EventStoreAdapter,
  Factory,
  Store,
  EventStore,
  EventStoreFactory
} from '../transmute-framework'

const bs58 = require('bs58')
const util = require('ethereumjs-util')

let ipfsAdapter = require('transmute-adapter-ipfs')
let nodeStorageAdapter = require('transmute-adapter-node-storage')

let nodeStorageDB = nodeStorageAdapter.getStorage()

const transmuteConfig = require('../transmute-config.json')

let ipfs = ipfsAdapter.getStorage(transmuteConfig.minikube.ipfs.config)

export const getDefaultEventStoreAdapter = () => {
  return new EventStoreAdapter({
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
    },
    N: {
      keyName: 'sha1',
      adapter: nodeStorageAdapter,
      db: nodeStorageDB,
      readIDFromBytes32: (bytes32: string) => {
        return util.toAscii(bytes32).replace(/\u0000/g, '')
      },
      writeIDToBytes32: (id: string) => {
        return id
      }
    }
  })
}

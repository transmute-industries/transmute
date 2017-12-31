const web3Utils = require('web3-utils')

import { Utils } from '../../Utils'

import { IFSA } from '../EventTypes'

import {
  ITransmuteStoreAdapter,
  ITransmuteStoreAdapterMap,
  TransmuteSolidityEncodingTypes,
  IWritableEventParams,
  IDirtyPayload
} from './EventStoreAdapterTypes'

import * as EventTransformer from '../../Utils/EventTransformer'

export class EventStoreAdapter {
  mapperKeys: string[]
  eventMap: any = {
    EsEvent: async (args: any) => {
      let fsa = EventTransformer.esEventToFSA(args)
      let mutatingEvent = {
        ...args,
        EventType: Utils.toAscii(args.EventType),
        Id: args.Id.toNumber(),
        Created: args.Created.toNumber(),
        KeyType: Utils.toAscii(args.KeyType),
        ValueType: Utils.toAscii(args.ValueType)
      }
      let keyMeta: any = await this.convertFromBytes32(mutatingEvent.Key, mutatingEvent.KeyType)
      let valueMeta: any = await this.convertFromBytes32(
        mutatingEvent.Value,
        mutatingEvent.ValueType
      )
      // console.log(mutatingEvent)
      // console.log(adapterPayload, args.Key)
      return {
        ...fsa,
        meta: {
          ...fsa.meta,
          adapter: {
            payload: {
              [Utils.toAscii(args.Key)]: valueMeta.key
            },
            encoding: mutatingEvent.ValueType
          }
        }
      }
    }
  }

  constructor(public mapper: ITransmuteStoreAdapterMap) {
    this.mapperKeys = Object.keys(mapper)

    this.throwOnAdapterTypeCollision()
    this.throwOnAdapterTypeConversionUndefined()
  }

  throwOnAdapterTypeCollision = () => {
    this.mapperKeys.forEach((mapperKey: string) => {
      if (TransmuteSolidityEncodingTypes.indexOf(mapperKey) !== -1) {
        throw new Error(
          'Mapper keys cannot container reserved encoding types: ' + TransmuteSolidityEncodingTypes
        )
      }
    })
  }

  throwOnAdapterTypeConversionUndefined = () => {
    this.mapperKeys.forEach((mapperKey: string) => {
      if (
        this.mapper[mapperKey] === undefined ||
        this.mapper[mapperKey].readIDFromBytes32 === undefined
      ) {
        throw new Error('Mapper : ' + mapperKey + ' does not implement IAdapterMapper')
      }
    })
  }

  getItem = async (adapter: ITransmuteStoreAdapter, db: any, key: string): Promise<any> => {
    return adapter.getItem(db, key)
  }

  setItem = async (adapter: ITransmuteStoreAdapter, db: any, value: any): Promise<string> => {
    return adapter.setItem(db, value)
  }

  writeEvents = async (adapter: EventStoreAdapter, events: any[]) => {
    let mapper = adapter.mapper
    return Promise.all(
      events.map(async event => {
        let partialEvent: any = {
          ...event,
          meta: {
            ...event.meta,
            key: await this.setItem(
              mapper[event.meta.adapter].adapter,
              mapper[event.meta.adapter].db,
              event.payload
            )
          }
        }

        return {
          ...partialEvent,
          payload: {
            [adapter.mapper[partialEvent.meta.adapter].keyName]: partialEvent.meta.key
          }
        }
      })
    )
  }

  readEvents = async (mapper: ITransmuteStoreAdapterMap, events: any[]) => {
    return Promise.all(
      events.map(async event => {
        return {
          ...event,
          payload: await this.getItem(
            mapper[event.meta.adapter].adapter,
            mapper[event.meta.adapter].db,
            event.meta.key
          ),
          meta: {
            ...event.meta
          }
        }
      })
    )
  }

  isPayloadKeySizeSafe = (keyValue: string, keyType: string) => {
    // ensure key does not exceed keyType size (bytes32 safety check)
    return keyValue.length <= 32
  }

  isPayloadMisleading = (dirtyPayload: IDirtyPayload) => {
    if (dirtyPayload.payloadKey === 'bytes32') {
      if (dirtyPayload.payloadValueType === 'B') {
        // check length
        if (dirtyPayload.payloadValue.length > 66) {
          // check hex chars only 0-f/F
          if (!Utils.isHex(dirtyPayload.payloadValue)) {
            throw new Error(
              'solidity bytes32 received invalid hex string: ' + dirtyPayload.payloadValue
            )
          }
        }
      }

      if (dirtyPayload.payloadValueType === 'S') {
        if (dirtyPayload.payloadValue.length > 32) {
          throw new Error(
            'payload value of type (S) is more than 32 bytes. value length = ' +
              dirtyPayload.payloadValue.length +
              ' chars'
          )
        }
      }
    }

    if (dirtyPayload.payloadKey === 'address') {
      if (dirtyPayload.payloadValueType !== 'A') {
        throw new Error(
          'payload of address type has none address value. ' +
            dirtyPayload.payloadValue +
            ' is not a valid address.'
        )
      }
    }
  }

  prepareFSAForStorage = async (fsa: IFSA): Promise<IWritableEventParams> => {
    let adapterMap = this.mapper

    if (fsa.type.length > 32) {
      throw new Error(
        'fsa.type (S) is more than 32 bytes. value length = ' + fsa.type.length + ' chars'
      )
    }

    if (typeof fsa.payload === 'object' && Object.keys(fsa.payload).length > 1) {
      try {
        if (adapterMap[fsa.meta.adapter] === undefined) {
          throw new Error('adapterMap not provided for event.meta.adapter: ' + fsa.meta.adapter)
        }
        let events = await this.writeEvents(this, [fsa])
        fsa = events[0]
      } catch (e) {
        throw new Error('Failed to save payload to adapter: ' + e.message)
      }
    }

    let payloadKeys = Object.keys(fsa.payload)
    let payloadKey = payloadKeys[0]
    let payloadKeyType = 'S'
    let payloadValue = fsa.payload[payloadKeys[0]]
    let payloadValueType = fsa.meta.adapter

    console.log('yo: use the EventTransformer here...')

    if (payloadValueType === undefined) {
      if (payloadKey === 'address' && Utils.isValidAddress(payloadValue)) {
        payloadValueType = 'A'
      }
      if (
        payloadKey === 'bytes32' &&
        (Utils.isHex(payloadValue) && Utils.formatHex(payloadValue) === payloadValue)
      ) {
        payloadValueType = 'B'
      }
      if (payloadKey === 'uint') {
        payloadValueType = 'U'
      }
      // always guess S
      if (payloadValueType === undefined) {
        payloadValueType = 'S'
      }
    }

    let dirtyPayload = {
      payloadKeys,
      payloadKey,
      payloadValue,
      payloadValueType,
      payloadKeyType
    }

    if (!this.isPayloadKeySizeSafe(dirtyPayload.payloadKey, dirtyPayload.payloadKeyType)) {
      throw Error('payload key to large. does not fit in bytes32 string (S).')
    }

    // console.log(dirtyPayload)

    // throws errors if payload is misleading
    this.isPayloadMisleading(dirtyPayload)

    return {
      keyType: dirtyPayload.payloadKeyType,
      keyValue: dirtyPayload.payloadKey,
      valueType: dirtyPayload.payloadValueType,
      valueValue: dirtyPayload.payloadValue
    }
  }

  convertFromBytes32 = async (bytes32: string, encoding: string) => {
    // console.log('bytes32', encoding)
    if (encoding === 'A') {
      return {
        key: 'address',
        value: '0x' + bytes32.split('0x000000000000000000000000')[1]
      }
    }

    if (encoding === 'B') {
      return {
        key: 'bytes32',
        value: bytes32
      }
    }

    if (encoding === 'U') {
      return {
        key: 'uint',
        value: web3Utils.hexToNumber(bytes32)
      }
    }

    if (encoding === 'S') {
      return {
        value: Utils.toAscii(bytes32)
      }
    }

    let identifier = this.mapper[encoding].readIDFromBytes32(bytes32)

    return {
      key: identifier,
      value: await this.mapper[encoding].adapter.getItem(this.mapper[encoding].db, identifier)
    }
  }

  convertValueToType = async (_valueType: any, _value: any) => {
    if (_valueType === 'B') {
      return _value
    }

    if (this.mapper[_valueType]) {
      _value = await this.mapper[_valueType].writeIDToBytes32(_value)
    }

    // // Left padd ints and addresses for bytes32 equivalence of Solidity casting
    if (_valueType === 'U' || _valueType === 'A') {
      _value = Utils.bufferToHex(Utils.setLengthLeft(_value, 32))
    }

    return _value
  }

  marshal = async (_eventType: any, _keyType: any, _valueType: any, _key: any, _value: any) => {
    return {
      eventType: _eventType,
      keyType: _keyType,
      valueType: _valueType,
      key: await this.convertValueToType(_keyType, _key),
      value: await this.convertValueToType(_valueType, _value)
    }
  }

  extractEventsFromLogs = async (logs: any[]) => {
    return Promise.all(
      logs.map(async log => {
        return this.eventMap[log.event](log.args)
      })
    )
  }
}

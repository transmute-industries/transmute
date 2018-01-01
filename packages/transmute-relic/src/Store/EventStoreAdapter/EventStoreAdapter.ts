import { W3 } from 'soltsice'

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
import { EventStore } from '../../SolidityTypes/index'

const WRITE_EVENT_GAS_COST = 4000000

export class EventStoreAdapter {
  mapperKeys: string[]
  eventMap: any = {
    EsEvent: async (args: any) => {
      let fsa = EventTransformer.esEventToFSA(args)
      if (fsa.payload !== undefined) {
        return fsa
      }

      let mutatingEvent = {
        Key: Utils.toAscii(args.Key),
        KeyType: Utils.toAscii(args.KeyType),
        Value: args.Value,
        ValueType: Utils.toAscii(args.ValueType)
      }
      // console.log(mutatingEvent.Value);
      let key = this.mapper[mutatingEvent.ValueType].readIDFromBytes32(mutatingEvent.Value)
      let value = await this.mapper[mutatingEvent.ValueType].adapter.getItem(
        this.mapper[mutatingEvent.ValueType].db,
        key
      )
      let adaptedEvent = {
        ...fsa,
        payload: {
          key,
          value
        },
        meta: {
          ...fsa.meta,
          adapter: mutatingEvent.ValueType
        }
      }
      let transparentAdaptedEvent = {
        ...adaptedEvent,
        payload: adaptedEvent.payload.value,
        meta: {
          ...adaptedEvent.meta,
          adapterPayload: {
            key: this.mapper[mutatingEvent.ValueType].keyName,
            value: adaptedEvent.payload.key
          }
        }
      }
      return transparentAdaptedEvent
    }
  }

  constructor(public mapper: ITransmuteStoreAdapterMap) {
    this.mapperKeys = Object.keys(mapper)

    this.throwOnAdapterTypeCollision()
    this.throwOnAdapterTypeConversionUndefined()
  }

  convertFSAPayload = async (fsa: IFSA) => {
    return {
      ...fsa,
      payload: {
        key: this.mapper[fsa.meta.adapter].keyName,
        value: await this.setItem(
          this.mapper[fsa.meta.adapter].adapter,
          this.mapper[fsa.meta.adapter].db,
          fsa.payload
        )
      }
    }
  }

  getEsEventParamsFromFSA = async (event: IFSA) => {
    let esEventParams: any
    switch (EventTransformer.getFSAType(event)) {
      case EventTransformer.FSATypes.Adapter:
        if (event.meta.adapter === undefined) {
          throw new Error(
            'fsa.meta.adapter is not defined. be sure to set it when fsa.payload is an object (isAdapterEvent).'
          )
        }
        // console.log("event: ", event);
        let adaptedEvent = await this.convertFSAPayload(event)
        // console.log("adaptedEvent: ", adaptedEvent);
        esEventParams = {
          keyType: 'S',
          keyValue: this.mapper[adaptedEvent.meta.adapter].keyName,
          valueType: adaptedEvent.meta.adapter,
          valueValue: adaptedEvent.payload.value
        }
        break
      case EventTransformer.FSATypes.SimpleKeyValue:
        esEventParams = {
          keyType: 'S',
          keyValue: event.payload.key,
          valueType: 'S',
          valueValue: event.payload.value
        }
        break
      case EventTransformer.FSATypes.Native:
        esEventParams = {
          keyType: 'S',
          keyValue: event.payload.key,
          valueType: EventTransformer.payloadKeyToKeyType[event.payload.key],
          valueValue: event.payload.value
        }
        break
    }
    return esEventParams
  }

  writeFSA = async (store: EventStore, fromAddress: string, event: IFSA): Promise<IFSA> => {
    if (event.type.length > 32) {
      throw new Error(
        'fsa.type (S) is more than 32 bytes. value length = ' + event.type.length + ' chars'
      )
    }

    let esEventParams = await this.getEsEventParamsFromFSA(event)

    // console.log("hmm: ", esEventParams);
    let marshalledEvent = await this.marshal(
      event.type,
      esEventParams.keyType,
      esEventParams.valueType,
      esEventParams.keyValue,
      esEventParams.valueValue
    )
    // console.log(JSON.stringify(marshalledEvent));
    let receipt = await store.writeEvent(
      marshalledEvent.eventType,
      marshalledEvent.keyType,
      marshalledEvent.valueType,
      marshalledEvent.key,
      marshalledEvent.value,
      W3.TC.txParamsDefaultDeploy(fromAddress, WRITE_EVENT_GAS_COST)
    )

    // console.log('receipt', receipt)
    let eventsFromLogs: IFSA[] = await this.extractEventsFromLogs(receipt.logs)

    // console.log(eventsFromLogs)
    if (receipt.logs.length > 1) {
      throw new Error('more than 1 event in write event log...')
    }
    return eventsFromLogs[0]
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

const bs58 = require('bs58')
const web3Utils = require('web3-utils')
const util = require('ethereumjs-util')

export namespace Utils {
  export const isVmException = (e: any) => {
    return e.toString().indexOf('VM Exception while') !== -1
  }

  export const isTypeError = (e: any) => {
    return e.toString().indexOf('TypeError') !== -1
  }

  export interface IFSA {
    type: string
    payload: any
    meta: any
  }

  export interface IRawEsCommand {
    EventType: string
    KeyType: string
    ValueType: string
    Key: string
    Value: string
  }

  export interface IRawEsEvent extends IRawEsCommand {
    Id: any
    TxOrigin: string
    Created: any
  }

  export interface IUnmarshalledEsCommand {
    eventType: string
    keyType: string
    valueType: string
    key: any
    value: any
  }

  export interface IFSACommand {
    type: string
    payload: any
    meta?: any
  }

  export interface IFSAEvent extends IFSACommand {
    meta: any
  }

  export interface ITransaction {
    tx: string
    receipt: any
    logs: any[]
  }

  export interface ITransmuteCommandResponse {
    events: Array<IFSAEvent>
    transactions: Array<ITransaction>
  }

  export interface IReadModel {
    lastEvent: number
    readModelType: string
    readModelStoreKey: string
    contractAddress: string
    model: any
  }

  export const toAscii = (value: string) => {
    return util.toAscii(value).replace(/\u0000/g, '')
  }

  export const grantItemFromEvent = (event: any) => {
    return {
      role: toAscii(event.role),
      resource: toAscii(event.resource),
      action: toAscii(event.action),
      attributes: event.attributes.map(toAscii)
    }
  }

  export const grantItemFromValues = (values: any) => {
    return {
      role: toAscii(values[0]),
      resource: toAscii(values[1]),
      action: toAscii(values[2]),
      attributes: values[3].map(toAscii)
    }
  }

  export const permissionFromCanRoleActionResourceValues = (values: any) => {
    return {
      granted: values[0],
      resource: toAscii(values[2]),
      attributes: values[0] ? ['*'] : [],
      _: {
        role: toAscii(values[1]),
        resource: toAscii(values[2]),
        attributes: values[0] ? ['*'] : [] // values[3].map(toAscii)
      }
    }
  }

  // https://blog.stakeventures.com/articles/smart-contract-terms
  export const hex2ipfshash = (hash: any) => {
    return bs58.encode(new Buffer('1220' + hash.slice(2), 'hex'))
  }

  export const ipfs2hex = (ipfshash: any) => {
    return '0x' + new Buffer(bs58.decode(ipfshash).slice(2)).toString('hex')
  }

  export const convertValueToType = (_valueType: any, _value: any) => {
    // 'I' Encodes that this is IPLD, so we know to remove Qm (and add it back)
    if (_valueType === 'I') {
      _value = ipfs2hex(_value)
    }
    // Left padd ints and addresses for bytes32 equivalence of Solidity casting
    if (_valueType === 'U' || _valueType === 'A') {
      _value = util.bufferToHex(util.setLengthLeft(_value, 32))
    }

    return _value
  }

  export const getValueFromType = (type: TransmuteEncodingType, value: any) => {
    switch (type) {
      case 'A':
        return '0x' + value.split('0x000000000000000000000000')[1]
      case 'U':
        return web3Utils.hexToNumber(value)
      case 'B':
        return value
      case 'S':
        return toAscii(value)
      case 'L':
        return toAscii(value)
      case 'I':
        return hex2ipfshash(value)
    }
  }

  export const guessTypeFromValue = (value: any): TransmuteEncodingType => {
    if (typeof value === 'number') {
      return 'U'
    }
    if (typeof value === 'object') {
      return 'I'
    }
    if (typeof value === 'string') {
      if (util.isValidAddress(value)) {
        return 'A'
      }
      if (isHex(value) && formatHex(value) === value) {
        return 'B'
      }
      return 'S'
    }
    throw Error('unable to guess type of value: ' + value)
  }

  export const marshal = (
    _eventType: any,
    _keyType: any,
    _valueType: any,
    _key: any,
    _value: any
  ) => {
    return {
      eventType: _eventType,
      keyType: _keyType,
      valueType: _valueType,
      key: convertValueToType(_keyType, _key),
      value: convertValueToType(_valueType, _value)
    }
  }

  export const getUnmarshalledObjectFromValues = (
    _id: any,
    _txOrigin: any,
    _created: any,
    _eventType: any,
    _keyType: any,
    _valueType: any,
    _key: any,
    _value: any
  ) => {
    _keyType = toAscii(_keyType)
    _valueType = toAscii(_valueType)
    _key = getValueFromType(_keyType, _key)
    _value = getValueFromType(_valueType, _value)

    return {
      id: _id.toNumber(),
      txOrigin: _txOrigin,
      created: _created.toNumber(),
      eventType: toAscii(_eventType),
      keyType: _keyType,
      valueType: _valueType,
      key: _key,
      value: _value
    }
  }

  export const unmarshal = (eventArgs: any) => {
    return getUnmarshalledObjectFromValues(
      eventArgs.Id,
      eventArgs.TxOrigin,
      eventArgs.Created,
      eventArgs.EventType,
      eventArgs.KeyType,
      eventArgs.ValueType,
      eventArgs.Key,
      eventArgs.Value
    )
  }

  export const getFSAFromFlat = (flat: any) => {
    let event: IFSA = {
      type: flat.eventType,
      payload: {
        [flat.key]: flat.value
      },
      meta: {
        id: flat.id,
        created: flat.created,
        txOrigin: flat.txOrigin,
        keyType: flat.keyType,
        valueType: flat.valueType
      }
    }

    if (['L', 'I'].indexOf(event.meta.valueType) !== -1) {
      event.meta.adapter = flat.valueType
      event.meta.key = flat.value
    }
    return event
  }

  export const getFSAFromEventValues = (
    _id: any,
    _txOrigin: any,
    _created: any,
    _eventType: any,
    _keyType: any,
    _valueType: any,
    _key: any,
    _value: any
  ): IFSAEvent => {
    let flat = getUnmarshalledObjectFromValues(
      _id,
      _txOrigin,
      _created,
      _eventType,
      _keyType,
      _valueType,
      _key,
      _value
    )
    return getFSAFromFlat(flat)
  }

  export const getFSAFromEventArgs = (eventArgs: any): IFSAEvent => {
    let flat = unmarshal(eventArgs)
    return getFSAFromFlat(flat)
  }

  export interface IEventResolverConfig {
    filters: Array<() => any>
    mappers: Array<() => any>
  }

  export const isHex = (h: any) =>
    h.replace(/^0x/i, '').match(/[0-9A-Fa-f]+$/)
      ? h.replace(/^0x/i, '').match(/[0-9A-Fa-f]+$/)['index'] === 0
      : false
  export const formatHex = (h: any) => '0x' + h.replace(/^0x/i, '') // assumes valid hex input .. 0x33/33 -> 0x33

  export const GAS_COSTS = {
    WRITE_EVENT: 4000000
  }

  export const isPayloadKeySizeSafe = (keyValue: string, keyType: string) => {
    // ensure key does not exceed keyType size (bytes32 safety check)
    return keyValue.length <= 32
  }

  export interface IDirtyPayload {
    payloadKeys: string[]
    payloadKey: string
    payloadValue: string
    payloadValueType: string
    payloadKeyType: string
  }

  export const isPayloadMisleading = (dirtyPayload: IDirtyPayload) => {
    if (dirtyPayload.payloadKey === 'bytes32') {
      if (dirtyPayload.payloadValueType === 'B') {
        // check length
        if (dirtyPayload.payloadValue.length > 66) {
          // check hex chars only 0-f/F
          if (!isHex(dirtyPayload.payloadValue)) {
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

  export type AdapterEncodingType = 'I' | 'L'

  export type TransmuteEncodingType = 'U' | 'S' | 'B' | 'A' | AdapterEncodingType

  export interface IWritableEventParams {
    keyType: TransmuteEncodingType
    keyValue: string
    valueType: TransmuteEncodingType
    valueValue: string
  }
}

const bs58 = require('bs58')
const util = require('ethereumjs-util')

const Web3 = require('web3')
const web3 = new Web3()

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

export const toAscii = value => {
  return util.toAscii(value).replace(/\u0000/g, '')
}

export const grantItemFromEvent = event => {
  return {
    role: toAscii(event.role),
    resource: toAscii(event.resource),
    action: toAscii(event.action),
    attributes: event.attributes.map(toAscii),
  }
}

export const grantItemFromValues = values => {
  return {
    role: toAscii(values[0]),
    resource: toAscii(values[1]),
    action: toAscii(values[2]),
    attributes: values[3].map(toAscii),
  }
}

export const permissionFromCanRoleActionResourceValues = values => {
  return {
    granted: values[0],
    resource: toAscii(values[2]),
    attributes: values[0] ? ['*'] : [],
    _: {
      role: toAscii(values[1]),
      resource: toAscii(values[2]),
      attributes: values[0] ? ['*'] : [], // values[3].map(toAscii)
    },
  }
}

// https://blog.stakeventures.com/articles/smart-contract-terms
export const hex2ipfshash = hash => {
  return bs58.encode(new Buffer('1220' + hash.slice(2), 'hex'))
}

export const ipfs2hex = ipfshash => {
  return '0x' + new Buffer(bs58.decode(ipfshash).slice(2)).toString('hex')
}

export const convertValueToType = (_valueType, _value) => {
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

export const getValueFromType = (type, value) => {
  switch (type) {
    case 'A':
      return '0x' + value.split('0x000000000000000000000000')[1]
    case 'U':
      return web3.toBigNumber(value).toNumber()
    case 'B':
      return value
    case 'X':
      return toAscii(value)
    case 'I':
      return hex2ipfshash(value)
  }
}

export const guessTypeFromValue = value => {
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
    if (value.length > 1 && value.substr(0, 2) === '0x') {
      return 'X'
    } else {
      return 'S'
    }
  }
  throw Error('unable to guess type of value: ' + value)
}

export const marshal = (_eventType, _keyType, _valueType, _key, _value) => {
  return {
    eventType: _eventType,
    keyType: _keyType,
    valueType: _valueType,
    key: convertValueToType(_keyType, _key),
    value: convertValueToType(_valueType, _value),
  }
}

export const getUnmarshalledObjectFromValues = (
  _id,
  _txOrigin,
  _created,
  _eventType,
  _keyType,
  _valueType,
  _key,
  _value
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
    value: _value,
  }
}

export const unmarshal = eventArgs => {
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

export const getFSAFromFlat = flat => {
  return {
    type: flat.eventType,
    payload: {
      [flat.key]: flat.value,
    },
    meta: {
      id: flat.id,
      created: flat.created,
      txOrigin: flat.txOrigin,
      keyType: flat.keyType,
      valueType: flat.valueType,
    },
  }
}

export const getFSAFromEventValues = (
  _id,
  _txOrigin,
  _created,
  _eventType,
  _keyType,
  _valueType,
  _key,
  _value
): IFSAEvent => {
  let flat = getUnmarshalledObjectFromValues(_id, _txOrigin, _created, _eventType, _keyType, _valueType, _key, _value)
  return getFSAFromFlat(flat)
}

export const getFSAFromEventArgs = (eventArgs): IFSAEvent => {
  let flat = unmarshal(eventArgs)
  return getFSAFromFlat(flat)
}

// http://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objects
export const flatten = data => {
  let result = {}
  function recurse(cur, prop) {
    if (Object(cur) !== cur) {
      result[prop] = cur
    } else if (Array.isArray(cur)) {
      for (let i = 0, l = cur.length; i < l; i++) recurse(cur[i], prop + '[' + i + ']')
      if (l === 0) result[prop] = []
    } else {
      let isEmpty = true
      for (let p in cur) {
        isEmpty = false
        recurse(cur[p], prop ? prop + '.' + p : p)
      }
      if (isEmpty && prop) result[prop] = {}
    }
  }
  recurse(data, '')
  return result
}

export const unflatten = (data: Object): Object => {
  if (Object(data) !== data || Array.isArray(data)) return data
  let regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
    resultholder = {}
  for (let p in data) {
    let cur = resultholder,
      prop = '',
      m
    while ((m = regex.exec(p))) {
      cur = cur[prop] || (cur[prop] = m[2] ? [] : {})
      prop = m[2] || m[1]
    }
    cur[prop] = data[p]
  }
  return resultholder[''] || resultholder
}

export interface IEventResolverConfig {
  filters: Array<() => any>
  mappers: Array<() => any>
}

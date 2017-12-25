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



}

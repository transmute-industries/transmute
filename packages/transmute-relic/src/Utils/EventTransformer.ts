import { IFSA, IRawEsEvent } from '../Store/EventTypes'

import { Utils } from './Utils'

export namespace EventTransformer {
  export const getFSAsFromReceipt = (receipt: any) => {
    let fsa: any[] = []
    receipt.logs.forEach((event: any) => {
      if (event.event === 'EsEvent') {
        fsa.push(EventTransformer.esEventToFSA(event.args))
      }
    })
    return fsa
  }

  export const filterEventsByMeta = (events: IFSA[], prop: any, propValue: any) => {
    let fsa: any[] = []
    events.forEach((event: any) => {
      if (event.meta[prop] === propValue) {
        fsa.push(event)
      }
    })
    return fsa
  }

  let valuesToEsEvent = (
    Id: any,
    TxOrigin: any,
    MsgSender: any,
    Created: any,
    EventType: any,
    KeyType: any,
    ValueType: any,
    Key: any,
    Value: any
  ): IRawEsEvent => {
    return {
      Id,
      TxOrigin,
      MsgSender,
      Created,
      EventType,
      KeyType,
      ValueType,
      Key,
      Value
    }
  }

  export const getFSAFromEsEventWithPartial = (esEvent: IRawEsEvent, partialFSA: IFSA) => {
    let payload
    switch (partialFSA.meta.valueType) {
      case 'A':
        payload = {
          key: 'address',
          value: '0x' + esEvent.Value.split('0x000000000000000000000000')[1]
        }
        break
      case 'B':
        payload = {
          key: 'bytes32',
          value: esEvent.Value
        }
        break
      case 'U':
        payload = {
          key: 'uint',
          value: Utils.hexToNumber(esEvent.Value)
        }
        break
      case 'S':
        payload = {
          key: Utils.toAscii(esEvent.Key),
          value: Utils.toAscii(esEvent.Value)
        }
        break
    }
    return {
      ...partialFSA,
      payload
    }
  }

  export const esEventToFSA = (esEvent: IRawEsEvent) => {
    let partialFSA: IFSA = {
      type: Utils.toAscii(esEvent.EventType),
      payload: {}, // this will be set by getFSAFromEsEventWithPartial
      meta: {
        keyType: Utils.toAscii(esEvent.KeyType),
        valueType: Utils.toAscii(esEvent.ValueType),
        id: esEvent.Id.toNumber(),
        created: esEvent.Created.toNumber(),
        txOrigin: esEvent.TxOrigin,
        msgSender: esEvent.MsgSender
      }
    }
    return getFSAFromEsEventWithPartial(esEvent, partialFSA) as IFSA
  }

  export const arrayToFSA = (values: any) => {
    let esEvent = valuesToEsEvent(
      values[0],
      values[1],
      values[2],
      values[3],
      values[4],
      values[5],
      values[6],
      values[7],
      values[8]
    )
    return esEventToFSA(esEvent)
  }
}

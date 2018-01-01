export interface IFSA {
  type: string
  payload: any
  meta: any
}

export interface IEsEvent {
  Id: any
  TxOrigin: string
  MsgSender: string
  Created: any
  EventType: string
  KeyType: string
  ValueType: string
  Key: string
  Value: string
}

export interface ITxReceipt {
  tx: string
  receipt: any
  logs: any[]
}

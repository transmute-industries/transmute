export interface IFSA {
  type: string;
  payload: any;
  meta: any;
}


export interface IRawEsCommand {
  EventType: string;
  KeyType: string;
  ValueType: string;
  Key: string;
  Value: string;
}

export interface IRawEsEvent extends IRawEsCommand {
  Id: any;
  TxOrigin: string;
  Created: any;
}

export interface IUnmarshalledEsCommand {
  eventType: string;
  keyType: string;
  valueType: string;
  key: any;
  value: any;
}

export interface ITransaction {
  tx: string;
  receipt: any;
  logs: any[];
}

export interface ITransmuteCommandResponse {
  events: Array<IFSA>;
  transactions: Array<ITransaction>;
}

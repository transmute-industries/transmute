
export interface IWritableEventParams {
  keyType: string
  keyValue: string
  valueType: string
  valueValue: string
}

export const TransmuteSolidityEncodingTypes = ["S", "B", "U"];
export type TransmuteSolidityEncodingType = "S" | "B" | "U";

export interface ITransmuteStoreAdapter {
  getStorage: () => any;
  getItem: (db: any, key: string) => Promise<any>;
  setItem: (db: any, value: any) => Promise<string>;
}

export interface IAdapterMapper {
  keyName: string;
  adapter: ITransmuteStoreAdapter;
  db: any;
  readIDFromBytes32: (bytes32: string) => string;
  writeIDToBytes32: (id: string) => string;
}

export interface ITransmuteStoreAdapterMap {
  [key: string]: IAdapterMapper;
}

export interface IDirtyPayload {
  payloadKeys: string[]
  payloadKey: string
  payloadValue: string
  payloadValueType: string
  payloadKeyType: string
}

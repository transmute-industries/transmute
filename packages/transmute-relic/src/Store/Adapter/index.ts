const util = require("ethereumjs-util");
const web3Utils = require("web3-utils");

import { Utils } from '../../Utils'

export const TransmuteSolidityEncodingTypes = ["S", "B", "U"];
export type TransmuteSolidityEncodingType = "S" | "B" | "U";

export interface ITransmuteStoreAdapter {
  getStorage: () => any;
  getItem: (db: any, key: string) => Promise<any>;
  setItem: (db: any, value: any) => Promise<string>;
}

export interface ITransmuteStoreAdapterMap {
  [key: string]: {
    keyName: string;
    adapter: ITransmuteStoreAdapter;
    db: any;
  };
}

export interface ITransmuteAdapterTypeConverter {
  getTransmuteEventPayloadIdentifierFromBytes32: (bytes32: string) => string;
}

export interface ITransmuteAdapterTypeConverterMap {
  [key: string]: ITransmuteAdapterTypeConverter;
}


export interface IStoreAdapter {
  getStorage: () => any;
  getItem: (db: any, key: string) => Promise<any>;
  setItem: (db: any, value: any) => Promise<string>;
}

export interface IStoreAdapterMap {
  [key: string]: any;
}


export const getItem = async (adapter: IStoreAdapter, db: any, key: string): Promise<any> => {
  return adapter.getItem(db, key);
};

export const setItem = async (adapter: IStoreAdapter, db: any, value: any): Promise<string> => {
  return adapter.setItem(db, value);
};

export const writeEvents = async (adapter: Adapter, events: any[]) => {
  let mapper = adapter.mapper;
  return Promise.all(
    events.map(async event => {
      let partialEvent: any = {
        ...event,
        meta: {
          ...event.meta,
          key: await setItem(
            mapper[event.meta.adapter].adapter,
            mapper[event.meta.adapter].db,
            event.payload
          )
        }
      };

      return {
        ...partialEvent,
        payload: {
          [adapter.mapper[partialEvent.meta.adapter].keyName]: partialEvent.meta.key
        }
      };
    })
  );
};

export const readEvents = async (mapper: IStoreAdapterMap, events: any[]) => {
  return Promise.all(
    events.map(async event => {
      return {
        ...event,
        payload: await getItem(
          mapper[event.meta.adapter].adapter,
          mapper[event.meta.adapter].db,
          event.meta.key
        ),
        meta: {
          ...event.meta
        }
      };
    })
  );
};

export class Adapter {
  mapperKeys: string[];

  eventMap: any = {
    EsEvent: async (args: any) => {
      let mutatingEvent = {
        ...args,
        EventType: util.toAscii(args.EventType).replace(/\u0000/g, ""),
        Id: args.Id.toNumber(),
        Created: args.Created.toNumber(),
        KeyType: util.toAscii(args.KeyType).replace(/\u0000/g, ""),
        ValueType: util.toAscii(args.ValueType).replace(/\u0000/g, "")
      };

      let adapterPayload = await this.convertFromBytes32(
        mutatingEvent.Value,
        mutatingEvent.ValueType
      );

      return {
        type: mutatingEvent.EventType,
        payload: adapterPayload.value,
        meta: {
          id: mutatingEvent.Id,
          created: mutatingEvent.Created,
          txOrigin: mutatingEvent.TxOrigin,

          // keyType: mutatingEvent.KeyType,
          // valueType: mutatingEvent.ValueType,
          // adapter: mutatingEvent.ValueType,
          adapter: {
            payload: {
              [util.toAscii(args.Key).replace(/\u0000/g, "")]: adapterPayload.key
            },
            encoding: mutatingEvent.ValueType
          }
        }
      };
    }
  };

  constructor(public mapper: ITransmuteStoreAdapterMap, public converter: any) {
    this.mapperKeys = Object.keys(mapper);

    this.throwOnAdapterTypeCollision();
    this.throwOnAdapterTypeConversionUndefined();
  }

  throwOnAdapterTypeCollision = () => {
    this.mapperKeys.forEach((mapperKey: string) => {
      if (TransmuteSolidityEncodingTypes.indexOf(mapperKey) !== -1) {
        throw new Error(
          "Mapper keys cannot container reserved encoding types: " + TransmuteSolidityEncodingTypes
        );
      }
    });
  };

  throwOnAdapterTypeConversionUndefined = () => {
    if (this.converter === undefined) {
      throw new Error("Adapter requires converter");
    }
    this.mapperKeys.forEach((mapperKey: string) => {
      if (this.converter[mapperKey] === undefined) {
        throw new Error("Converter not populated for adapter type: " + mapperKey);
      }

      if (this.converter[mapperKey].readIDFromBytes32 === undefined) {
        throw new Error(
          "Converter : " + mapperKey + " does not implement ITransmuteAdapterTypeConverter"
        );
      }
    });
  };

 prepareFSAForStorage = async (
    fsa: Utils.IFSA
  ): Promise<Utils.IWritableEventParams> => {
    let adapterMap = this.mapper

    if (fsa.type.length > 32) {
      throw new Error(
        "fsa.type (S) is more than 32 bytes. value length = " + fsa.type.length + " chars"
      );
    }

    if (typeof fsa.payload === "object" && Object.keys(fsa.payload).length > 1) {
      try {
        if (adapterMap[fsa.meta.adapter] === undefined) {
          throw new Error("adapterMap not provided for event.meta.adapter: " + fsa.meta.adapter);
        }
        let events = await writeEvents(this, [fsa]);
        fsa = events[0];
      } catch (e) {
        throw new Error("Failed to save payload to adapter: " + e.message);
      }
    }

    let payloadKeys = Object.keys(fsa.payload);
    let payloadKey = payloadKeys[0];
    let payloadKeyType: Utils.TransmuteEncodingType = "S";
    let payloadValue = fsa.payload[payloadKeys[0]];
    let payloadValueType = fsa.meta.adapter;

    if (payloadValueType === undefined) {
      if (payloadKey === "address" && util.isValidAddress(payloadValue)) {
        payloadValueType = "A";
      }
      if (
        payloadKey === "bytes32" &&
        (Utils.isHex(payloadValue) && Utils.formatHex(payloadValue) === payloadValue)
      ) {
        payloadValueType = "B";
      }
      if (payloadKey === "uint") {
        payloadValueType = "U";
      }
      // always guess S
      if (payloadValueType === undefined){
        payloadValueType = 'S'
      }
    }

    let dirtyPayload = {
      payloadKeys,
      payloadKey,
      payloadValue,
      payloadValueType,
      payloadKeyType
    };

    if (!Utils.isPayloadKeySizeSafe(dirtyPayload.payloadKey, dirtyPayload.payloadKeyType)) {
      throw Error("payload key to large. does not fit in bytes32 string (S).");
    }

    // console.log(dirtyPayload)

    // throws errors if payload is misleading
    Utils.isPayloadMisleading(dirtyPayload);

    return {
      keyType: dirtyPayload.payloadKeyType,
      keyValue: dirtyPayload.payloadKey,
      valueType: dirtyPayload.payloadValueType,
      valueValue: dirtyPayload.payloadValue
    };
  };


  convertFromBytes32 = async (bytes32: string, encoding: string) => {
    if (encoding === "A") {
      return {
        value: "0x" + bytes32.split("0x000000000000000000000000")[1]
      };
    }

    if (encoding === "B") {
      return {
        value: bytes32
      };
    }

    if (encoding === "U") {
      return {
        value: web3Utils.hexToNumber(bytes32);
      };
    }

    if (encoding === "S") {
      return {
        value: util.toAscii(bytes32).replace(/\u0000/g, "")
      };
    }

    let identifier = this.converter[encoding].readIDFromBytes32(bytes32);

    return {
      key: identifier,
      value: await this.mapper[encoding].adapter.getItem(this.mapper[encoding].db, identifier)
    };
  };

  convertValueToType = async (_valueType: any, _value: any) => {
    if (_valueType === "B") {
      return _value;
    }

    if (this.converter[_valueType]) {
      _value = await this.converter[_valueType].writeIDToBytes32(_value);
    }

    // // Left padd ints and addresses for bytes32 equivalence of Solidity casting
    if (_valueType === "U" || _valueType === "A") {
      _value = util.bufferToHex(util.setLengthLeft(_value, 32));
    }

    return _value;
  };

  marshal = async (_eventType: any, _keyType: any, _valueType: any, _key: any, _value: any) => {
    return {
      eventType: _eventType,
      keyType: _keyType,
      valueType: _valueType,
      key: await this.convertValueToType(_keyType, _key),
      value: await this.convertValueToType(_valueType, _value)
    };
  };

  valuesToEsEvent = async (
    Id: any,
    TxOrigin: any,
    Created: any,
    EventType: any,
    KeyType: any,
    ValueType: any,
    Key: any,
    Value: any
  ) => {
    return {
      Id,
      TxOrigin,
      Created,
      EventType,
      KeyType,
      ValueType,
      Key,
      Value
    };
  };

  extractEventsFromLogs = async (logs: any[]) => {
    return Promise.all(
      logs.map(async log => {
        return this.eventMap[log.event](log.args);
      })
    );
  };


}

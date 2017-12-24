import { Utils } from "../../Utils";

export namespace Adapter {
  export type Type = "IPFS" | "LevelDB";

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

  export const writeEvents = async (mapper: IStoreAdapterMap, events: any[]) => {
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
            [Utils.getAdapterEncodingKeyName(partialEvent.meta.adapter)]: partialEvent.meta.key
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

  export const prepareFSAForStorage = async (
    adapterMap: any,
    fsa: Utils.IFSA
  ): Promise<Utils.IWritableEventParams> => {
    if (fsa.type.length > 32) {
      throw new Error(
        "fsa.type (S) is more than 32 bytes. value length = " + fsa.type.length + " chars"
      );
    }

    if (typeof fsa.payload === "object" && Object.keys(fsa.payload).length > 1) {

      try{
        if (adapterMap[fsa.meta.adapter] === undefined) {
          throw new Error("adapterMap not provided for event.meta.adapter: " + fsa.meta.adapter);
        }
        let events = await Adapter.writeEvents(adapterMap, [fsa]);
        fsa = events[0];
      } catch(e){
        throw new Error('Failed to save payload to adapter: ' + e.message)
      }

    }

    let payloadKeys = Object.keys(fsa.payload);
    let payloadKey = payloadKeys[0];
    let payloadKeyType: Utils.TransmuteEncodingType = "S";
    let payloadValue = fsa.payload[payloadKeys[0]];
    let payloadValueType = fsa.meta.adapter || Utils.guessTypeFromValue(payloadValue);

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

    // throws errors if payload is misleading
    Utils.isPayloadMisleading(dirtyPayload);

    return {
      keyType: dirtyPayload.payloadKeyType,
      keyValue: dirtyPayload.payloadKey,
      valueType: dirtyPayload.payloadValueType,
      valueValue: dirtyPayload.payloadValue
    };
  };
}

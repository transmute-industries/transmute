import { UnsafeEventStore } from "../types/UnsafeEventStore";
import { EventStore } from "../types/EventStore";
import { W3 } from "soltsice";

import { Utils } from "../Utils";
import { Adapter } from "./Adapter";

import { IFSA } from "./EventTypes";

export const GAS_COSTS = {
  WRITE_EVENT: 4000000
};

export namespace Store {
  export type GenericEventStore = UnsafeEventStore | EventStore;

  export enum Types {
    UnsafeEventStore,
    EventStore
  }

  /**
   * Store typeClassMapper
   */
  export const typeClassMapper = (name: Types) => {
    switch (name) {
      case Types.UnsafeEventStore:
        return UnsafeEventStore;
      default:
        return EventStore;
    }
  };

  /**
   * Store eventCount
   */
  export const eventCount = async (store: GenericEventStore, web3: any, fromAddress: string) => {
    let countBigNumber = await store.eventCount(W3.TC.txParamsDefaultDeploy(fromAddress));
    return countBigNumber.toNumber();
  };

  /**
   * Store readFSA
   */
  export const readFSA = async (
    store: GenericEventStore,
    adapter: Adapter,
    web3: any,
    fromAddress: string,
    eventId: number
  ) => {
    let solidityValues: any = await store.readEvent(
      eventId,
      W3.TC.txParamsDefaultDeploy(fromAddress)
    );
    let esEvent = await adapter.valuesToEsEvent(
      solidityValues[0],
      solidityValues[1],
      solidityValues[2],
      solidityValues[3],
      solidityValues[4],
      solidityValues[5],
      solidityValues[6],
      solidityValues[7]
    );
    return adapter.eventMap.EsEvent(esEvent);
  };

  /**
   * Store writeFSA
   */
  export const writeFSA = async (
    store: GenericEventStore,
    adapter: Adapter,
    web3: any,
    fromAddress: string,
    event: IFSA
  ): Promise<IFSA> => {
    if (typeof event.payload === "string") {
      throw new Error("event.payload must be an object, not a string.");
    }

    if (Array.isArray(event.payload)) {
      throw new Error("event.payload must be an object, not an array.");
    }

    // these 2 should be consolidated into a single adapter method
    let { keyType, keyValue, valueType, valueValue } = await adapter.prepareFSAForStorage(event);
    let marshalledEvent = await adapter.marshal(
      event.type,
      keyType,
      valueType,
      keyValue,
      valueValue
    );

    // console.log(keyValue)

    let receipt = await store.writeEvent(
      marshalledEvent.eventType,
      marshalledEvent.keyType,
      marshalledEvent.valueType,
      marshalledEvent.key,
      marshalledEvent.value,
      W3.TC.txParamsDefaultDeploy(fromAddress, GAS_COSTS.WRITE_EVENT)
    );

    let eventsFromLogs: IFSA[] = await adapter.extractEventsFromLogs(receipt.logs);

    if (eventsFromLogs.length > 1) {
      throw new Error("somehow we are writing more than 1 event....");
    }
    return eventsFromLogs[0];
  };

  export const writeFSAs = async (
    store: GenericEventStore,
    adapter: Adapter,
    web3: any,
    fromAddress: string,
    events: IFSA[]
  ): Promise<IFSA[]> => {
    return Promise.all(
      events.map(event => {
        return writeFSA(store, adapter, web3, fromAddress, event);
      })
    );
  };

  export const readFSAs = async (
    store: GenericEventStore,
    adapter: Adapter,
    web3: any,
    fromAddress: string,
    eventIndex: number = 0
  ): Promise<IFSA[]> => {
    let endIndex: number = await eventCount(store, web3, fromAddress);
    let events = [];
    for (let i: number = eventIndex; i < endIndex; i++) {
      events.push(await readFSA(store, adapter, web3, fromAddress, i));
    }
    return Promise.all(events);
  };
}

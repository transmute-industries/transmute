import { UnsafeEventStore } from "../types/UnsafeEventStore";
import { EventStore } from "../types/EventStore";
import { W3 } from "soltsice";

import { Utils } from "../Utils";
import { Adapter } from "./Adapter/Adapter";

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
    W3.Default = web3;
    let countBigNumber = await store.eventCount(W3.TC.txParamsDefaultDeploy(fromAddress));
    return countBigNumber.toNumber();
  };

  /**
   * Store readFSA
   */
  export const readFSA = async (
    store: GenericEventStore,
    adapterMap: Adapter.IStoreAdapterMap,
    web3: any,
    fromAddress: string,
    eventId: number
  ) => {
    W3.Default = web3;

    let solidityValues: any = await store.readEvent(
      eventId,
      W3.TC.txParamsDefaultDeploy(fromAddress)
    );

    let fsa = Utils.getFSAFromEventValues(
      solidityValues[0],
      solidityValues[1],
      solidityValues[2],
      solidityValues[3],
      solidityValues[4],
      solidityValues[5],
      solidityValues[6],
      solidityValues[7]
    );
    if (fsa.meta.adapter && adapterMap[fsa.meta.adapter] === undefined) {
      throw new Error("No adapterMap provided for event encoding: " + fsa.meta.adapter);
    }

    // console.log('look at event here...', fsa )

    let adaptedEvents = await Adapter.readEvents(adapterMap, [fsa]);

    return adaptedEvents[0];
  };

  export const writeUnmarshalledEsCommand = async (
    eventStore: any,
    fromAddress: string,
    esEvent: Utils.IUnmarshalledEsCommand
  ): Promise<Utils.ITransaction> => {
    let marshalledEvent = Utils.marshal(
      esEvent.eventType,
      esEvent.keyType,
      esEvent.valueType,
      esEvent.key,
      esEvent.value
    );

    return eventStore.writeEvent(
      marshalledEvent.eventType,
      marshalledEvent.keyType,
      marshalledEvent.valueType,
      marshalledEvent.key,
      marshalledEvent.value,
      W3.TC.txParamsDefaultDeploy(fromAddress, Utils.GAS_COSTS.WRITE_EVENT)
    );
  };

  /**
   * Store writeFSA
   */
  export const writeFSA = async (
    store: GenericEventStore,
    adapterMap: Adapter.IStoreAdapterMap,
    web3: any,
    fromAddress: string,
    event: Utils.IFSA
  ): Promise<Utils.IFSA[]> => {
    W3.Default = web3;
    // console.log("write here...");

    if (typeof event.payload === "string") {
      throw new Error("event.payload must be an object, not a string.");
    }

    if (Array.isArray(event.payload)) {
      throw new Error("event.payload must be an object, not an array.");
    }

    let params = await Adapter.prepareFSAForStorage(adapterMap, event);

    // console.log("are params correct:", params);

    // Marshlling
    let unmarshalledEsCommand: Utils.IUnmarshalledEsCommand = {
      eventType: event.type,
      keyType: params.keyType,
      valueType: params.valueType,
      key: params.keyValue,
      value: params.valueValue
    };

    // console.log('correct length? ', unmarshalledEsCommand.value, unmarshalledEsCommand.value.length)

    // console.log(unmarshalledEsCommand.value, unmarshalledEsCommand.value.length);

    if (
      event.meta.adapter &&
      event.meta.adapter !== "I" &&
      unmarshalledEsCommand.value.length > 32
    ) {
      throw new Error(
        "Value encoding has failed, and " +
          unmarshalledEsCommand.value +
          " cannot be saved as bytes32."
      );
    }

    let receipt = await writeUnmarshalledEsCommand(store, fromAddress, unmarshalledEsCommand);

    return receipt.logs.map(event => {
      return Utils.getFSAFromEventArgs(event.args);
    });

    // return store.readEvent(eventId, W3.TC.txParamsDefaultDeploy(fromAddress));
  };
}

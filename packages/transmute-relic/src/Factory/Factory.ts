import { UnsafeEventStoreFactory } from "../types/UnsafeEventStoreFactory";
import { EventStoreFactory } from "../types/EventStoreFactory";
import { W3 } from "soltsice";

import { Adapter } from "../Store/Adapter";

export namespace Factory {
  export type GenericFactory = UnsafeEventStoreFactory | EventStoreFactory;

  export enum Types {
    UnsafeEventStoreFactory,
    EventStoreFactory
  }

  /**
   * Factory typeClassMapper
   */
  export const typeClassMapper = (name: Types) => {
    switch (name) {
      case Types.UnsafeEventStoreFactory:
        return UnsafeEventStoreFactory;
      default:
        return EventStoreFactory;
    }
  };

  /**
   * Factory create
   */
  export const create = async (type: Types, web3: any, fromAddress: string) => {
    W3.Default = web3;
    const factoryClass = typeClassMapper(type);
    const instance = await factoryClass.New(W3.TC.txParamsDefaultDeploy(fromAddress), {
      _multisig: fromAddress
    });
    return instance;
  };

  /**
   * Factory createStore
   */
  export const createStore = async (
    factory: GenericFactory,
    adapter: Adapter,
    web3: any,
    fromAddress: string
  ) => {
    W3.Default = web3;
    let receipt = await factory.createEventStore(W3.TC.txParamsDefaultDeploy(fromAddress));
    return adapter.extractEventsFromLogs(receipt.logs);
  };
}

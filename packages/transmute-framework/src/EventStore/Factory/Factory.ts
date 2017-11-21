"use strict";

import { getFSAFromEventArgs, IFSAEvent } from "../Utils/Common";

import {
  readModel as factoryReadModel,
  reducer as factoryReducer
} from "./Reducer";

import { ITransmuteFramework } from "../../transmute-framework";

import * as Common from "../Utils/Common";

import { Permissions } from "../Permissions/Permissions";

export class Factory extends Permissions {
  constructor(public framework: ITransmuteFramework) {
    super(framework);
  }

  createEventStore = async (factory, fromAddress) => {
    let tx = await factory.createEventStore({
      from: fromAddress,
      gas: 4000000
    });

    let fsa = getFSAFromEventArgs(tx.logs[0].args);
    return {
      events: [fsa],
      tx: tx
    };
  };

  getAllEventStoreContractAddresses = async (factory, fromAddress) => {
    let addresses = await factory.getEventStores({
      from: fromAddress
    });
    return addresses;
  };

  getFactoryReadModel = async (factory: any, fromAddress: string) => {
    return this.framework.ReadModel.getCachedReadModel(
      factory,
      fromAddress,
      factoryReadModel,
      factoryReducer
    );
  };
}

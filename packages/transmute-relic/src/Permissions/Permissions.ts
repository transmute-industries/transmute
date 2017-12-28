import { W3 } from "soltsice";

import { RBAC } from "../types/RBAC";

import { IReadModelState, IReadModelAdapter } from "../Store/ReadModel/ReadModelTypes";
import { StoreAdapter } from "../Store/StoreAdapter";

import PermissionsReadModel from "./ReadModel";
import { ReadModel } from "../Store/ReadModel";

export namespace Permissions {
  export interface IPermissions {
    setAddressRole: (
      acc: any,
      fromAddress: string,
      targetAddress: string,
      targetRole: string
    ) => Promise<any>;

    setGrant: (
      acc: any,
      fromAddress: string,
      role: string,
      resource: string,
      action: string,
      attributes: string[]
    ) => Promise<any>;

    getGrant: (acc: any, fromAddress: string, index: number) => Promise<any>;

    canRoleActionResource: (
      acc: any,
      fromAddress: string,
      role: string,
      action: string,
      resource: string
    ) => Promise<boolean>;

    getPermissionsReadModel: (acc: any, fromAddress: string) => Promise<IReadModelState>;
  }

  export const setAddressRole = async (
    permContract: any,
    fromAddress: string,
    targetAddress: string,
    targetRole: string
  ) => {
    let receipt = await permContract.setAddressRole(
      targetAddress,
      targetRole,
      W3.TC.txParamsDefaultDeploy(fromAddress)
    );

    console.log("receipt: ", receipt);
    return receipt;
    // let fsa = Common.getFSAFromEventArgs(tx.logs[0].args)
    // return {
    //   events: [fsa],
    //   tx: tx,
    // }
  };

  export const getReadModel = async (
    permContract: any,
    adapter: StoreAdapter,
    readModelAdapter: IReadModelAdapter,
    web3: any,
    fromAddress: string
  ) => {
    let state: IReadModelState = JSON.parse(JSON.stringify(PermissionsReadModel.initialState));

    // console.log('permContract: ', permContract)
    state.contractAddress = permContract.address;
    state.readModelStoreKey = `${state.readModelType}:${state.contractAddress}`;

    let permReadModel = new ReadModel(readModelAdapter, PermissionsReadModel.reducer, state);

    let changes = await permReadModel.sync(permContract, adapter, web3, fromAddress);

    return permReadModel;
  };
}

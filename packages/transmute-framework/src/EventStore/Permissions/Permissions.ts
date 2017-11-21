import * as _ from 'lodash'

import { ITransmuteFramework } from '../../transmute-framework'

import * as Common from '../Utils/Common'

import { readModel as permissionsReadModel, reducer as permissionsReducer } from './Reducer'

export interface IPermissions {
  setAddressRole: (acc: any, fromAddress: string, targetAddress: string, targetRole: string) => Promise<any>

  setGrant: (
    acc: any,
    fromAddress: string,
    role: string,
    resource: string,
    action: string,
    attributes: string[]
  ) => Promise<any>

  getGrant: (acc: any, fromAddress: string, index: number) => Promise<any>

  canRoleActionResource: (
    acc: any,
    fromAddress: string,
    role: string,
    action: string,
    resource: string
  ) => Promise<boolean>

  getPermissionsReadModel: (acc: any, fromAddress: string) => Promise<Common.IReadModel>
}

export class Permissions implements IPermissions {
  constructor(public framework: ITransmuteFramework) {}

  setAddressRole = async (acc, fromAddress, targetAddress: string, targetRole: string) => {
    let tx = await acc.setAddressRole(targetAddress, targetRole, {
      from: fromAddress,
      gas: 4000000,
    })
    let fsa = Common.getFSAFromEventArgs(tx.logs[0].args)
    return {
      events: [fsa],
      tx: tx,
    }
  }

  setGrant = async (
    acc: any,
    fromAddress: string,
    role: string,
    resource: string,
    action: string,
    attributes: string[]
  ) => {
    let tx = await acc.setGrant(role, resource, action, attributes, {
      from: fromAddress,
      gas: 4000000,
    })
    // second event is EsEvent...
    let fsa = Common.getFSAFromEventArgs(tx.logs[1].args)
    return {
      events: [fsa],
      tx: tx,
    }
  }

  getGrant = async (acc, fromAddress, index: number) => {
    let grantVals = await acc.getGrant.call(index, {
      from: fromAddress,
    })
    let grant = Common.grantItemFromValues(grantVals)
    return grant
  }

  canRoleActionResource = async (
    acc: any,
    fromAddress: string,
    role: string,
    action: string,
    resource: string
  ): Promise<boolean> => {
    let vals = await acc.canRoleActionResource.call(role, action, resource, {
      from: fromAddress,
    })
    return vals[0]
  }

  // This is a nice example of why we built the framework
  // Here we are reading events from an EventStore on chain, and then reading
  // a smart contract and augmenting the event with the data in just a few lines.
  // maybeSyncReadModel is very powerfull function which handles any event sourced object
  // construction from a stream, and caches in either a document store or locally.
  async getPermissionsReadModel(acc: any, fromAddress: string): Promise<any> {
    const eventResolverConfig = {
      filters: [
        (event: Common.IFSAEvent) => {
          return event.type === 'AC_GRANT_WRITTEN'
        },
      ],
      mappers: [
        async event => {
          event.payload.grant = await this.getGrant(acc, fromAddress, event.payload.index)
          event.meta.extended = ['grant']
          return event
        },
      ],
    }
    return this.framework.ReadModel.maybeSyncReadModel(
      acc,
      fromAddress,
      permissionsReadModel,
      permissionsReducer,
      eventResolverConfig
    )
  }
}

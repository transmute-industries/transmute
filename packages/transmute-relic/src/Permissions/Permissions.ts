import { IReadModelState } from "../Store/ReadModel/ReadModelTypes";

import { RBAC } from "../types/RBAC";

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

}

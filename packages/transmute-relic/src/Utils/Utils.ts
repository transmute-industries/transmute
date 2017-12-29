const bs58 = require("bs58");
const web3Utils = require("web3-utils");
const util = require("ethereumjs-util");

import { IFSA, IRawEsEvent } from "../Store/EventTypes";

export namespace Utils {

  let valuesToEsEvent = (
    Id: any,
    TxOrigin: any,
    Created: any,
    EventType: any,
    KeyType: any,
    ValueType: any,
    Key: any,
    Value: any
  ): IRawEsEvent => {
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

  export const getFSAFromEsEventWithPartial = async (esEvent: IRawEsEvent, partialFSA: IFSA) => {
    switch (partialFSA.meta.valueType) {
      case "A":
        return {
          key: "address",
          value: "0x" + esEvent.Value.split("0x000000000000000000000000")[1]
        };
      case "B":
        return {
          key: "bytes32",
          value: esEvent.Value
        };
      case "U":
        return {
          key: "uint",
          value: web3Utils.hexToNumber(esEvent.Value)
        };
      case "S":
        return {
          key: toAscii(esEvent.Key),
          value: toAscii(esEvent.Value)
        };
    }
  };

  export const convertEventValueArrayToFSA = (values: any) => {
    let esEvent = valuesToEsEvent(
      values[0],
      values[1],
      values[2],
      values[3],
      values[4],
      values[5],
      values[6],
      values[7]
    );
    let partialFSA: IFSA = {
      type: toAscii(esEvent.EventType),
      payload: {}, // this will be set by getFSAFromEsEventWithPartial
      meta: {
        keyType: toAscii(esEvent.KeyType),
        valueType: toAscii(esEvent.ValueType),
        id: esEvent.Id.toNumber(),
        created: esEvent.Created.toNumber()
      }
    };
    return getFSAFromEsEventWithPartial(esEvent, partialFSA);
  };

  export const isVmException = (e: any) => {
    return e.toString().indexOf("VM Exception while") !== -1;
  };

  export const isTypeError = (e: any) => {
    return e.toString().indexOf("TypeError") !== -1;
  };

  export const toAscii = (value: string) => {
    return util.toAscii(value).replace(/\u0000/g, "");
  };

  export const grantItemFromEvent = (event: any) => {
    return {
      role: toAscii(event.role),
      resource: toAscii(event.resource),
      action: toAscii(event.action),
      attributes: event.attributes.map(toAscii)
    };
  };

  export const grantItemFromValues = (values: any) => {
    return {
      role: toAscii(values[0]),
      resource: toAscii(values[1]),
      action: toAscii(values[2]),
      attributes: values[3].map(toAscii)
    };
  };

  export const permissionFromCanRoleActionResourceValues = (values: any) => {
    return {
      granted: values[0],
      resource: toAscii(values[2]),
      attributes: values[0] ? ["*"] : [],
      _: {
        role: toAscii(values[1]),
        resource: toAscii(values[2]),
        attributes: values[0] ? ["*"] : [] // values[3].map(toAscii)
      }
    };
  };

  // https://blog.stakeventures.com/articles/smart-contract-terms
  export const hex2ipfshash = (hash: any) => {
    return bs58.encode(new Buffer("1220" + hash.slice(2), "hex"));
  };

  export const ipfs2hex = (ipfshash: any) => {
    return "0x" + new Buffer(bs58.decode(ipfshash).slice(2)).toString("hex");
  };

  export interface IEventResolverConfig {
    filters: Array<() => any>;
    mappers: Array<() => any>;
  }

  export const isHex = (h: any) =>
    h.replace(/^0x/i, "").match(/[0-9A-Fa-f]+$/)
      ? h.replace(/^0x/i, "").match(/[0-9A-Fa-f]+$/)["index"] === 0
      : false;

  export const formatHex = (h: any) => "0x" + h.replace(/^0x/i, ""); // assumes valid hex input .. 0x33/33 -> 0x33

  export const hexToNumber = (h: any) => {
    return web3Utils.hexToNumber(h)
  }
}

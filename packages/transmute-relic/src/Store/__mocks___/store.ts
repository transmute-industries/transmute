import Relic from "../../transmute-relic";
import { Factory } from "../../Factory";
import { Store } from "../Store";

const bs58 = require("bs58");
const util = require("ethereumjs-util");

import { UnsafeEventStoreFactory } from "../../types/UnsafeEventStoreFactory";
import { UnsafeEventStore } from "../../types/UnsafeEventStore";

let ipfsAdapter = require("../../../../transmute-adapter-ipfs");
let nodeStorageAdapter = require("../../../../transmute-adapter-node-storage");

let leveldb = nodeStorageAdapter.getStorage();
let ipfs = ipfsAdapter.getStorage();

import { Adapter } from "../Adapter";
const adapter = new Adapter(
  {
    I: {
      keyName: "multihash",
      adapter: ipfsAdapter,
      db: ipfs
    },
    N: {
      keyName: "sha1",
      adapter: nodeStorageAdapter,
      db: leveldb
    }
  },
  {
    I: {
      readIDFromBytes32: (bytes32: string) => {
        return bs58.encode(new Buffer("1220" + bytes32.slice(2), "hex"));
      },
      writeIDToBytes32: (id: string) => {
        return "0x" + new Buffer(bs58.decode(id).slice(2)).toString("hex");
      }
    },
    N: {
      readIDFromBytes32: (bytes32: string) => {
        return util.toAscii(bytes32).replace(/\u0000/g, "");
      },
      writeIDToBytes32: (id: string) => {
        return id;
      }
    }
  }
);

export const getSetupAsync = async () => {

  const relic = new Relic({
    providerUrl: "http://localhost:8545"
  });

  const accounts = await relic.getAccounts();
  const factory = await Factory.create(
    Factory.Types.UnsafeEventStoreFactory,
    relic.web3,
    accounts[0]
  );

  let events = await Factory.createStore(factory, adapter, relic.web3, accounts[0]);
  const store = await UnsafeEventStore.At(events[0].payload.address);

  return {
    relic,
    factory,
    store,
    adapter,
    accounts
  };
};

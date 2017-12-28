import { W3 } from "soltsice";
import Relic from "../transmute-relic";
import { Factory } from "../Factory";
import { Store } from "../Store";
import { StoreAdapter } from "../Store/StoreAdapter";

const bs58 = require("bs58");
const util = require("ethereumjs-util");

import { UnsafeEventStoreFactory } from "../types/UnsafeEventStoreFactory";
import { UnsafeEventStore } from "../types/UnsafeEventStore";

import { RBACEventStoreFactory } from "../types/RBACEventStoreFactory";
import { RBACEventStore } from "../types/RBACEventStore";

let ipfsAdapter = require("../../../transmute-adapter-ipfs");
let nodeStorageAdapter = require("../../../transmute-adapter-node-storage");

let leveldb = nodeStorageAdapter.getStorage();
let ipfs = ipfsAdapter.getStorage();

const Storage = require("node-storage");
const db = new Storage("./read_model_storage");
const nodeStorageReadModelAdapter: any = {
  getItem: (id: string) => {
    return JSON.parse(db.get(id));
  },
  setItem: (id: string, value: any) => {
    return db.put(id, JSON.stringify(value));
  }
};



const adapter = new StoreAdapter({
  I: {
    keyName: "multihash",
    adapter: ipfsAdapter,
    db: ipfs,
    readIDFromBytes32: (bytes32: string) => {
      return bs58.encode(new Buffer("1220" + bytes32.slice(2), "hex"));
    },
    writeIDToBytes32: (id: string) => {
      return "0x" + new Buffer(bs58.decode(id).slice(2)).toString("hex");
    }
  },
  N: {
    keyName: "sha1",
    adapter: nodeStorageAdapter,
    db: leveldb,
    readIDFromBytes32: (bytes32: string) => {
      return util.toAscii(bytes32).replace(/\u0000/g, "");
    },
    writeIDToBytes32: (id: string) => {
      return id;
    }
  }
});

export const createStoreInstances = async (
  web3: W3,
  fromAddress: string,
  factoryInstances: any
) => {
  return;
};

export const getSetupAsync = async () => {
  const relic = new Relic({
    providerUrl: "http://localhost:8545"
  });

  const accounts = await relic.getAccounts();

  let factoryInstances = {
    unsafe: await Factory.create(
      Factory.FactoryTypes.UnsafeEventStoreFactory,
      relic.web3,
      accounts[0]
    ),
    rbac: await Factory.create(Factory.FactoryTypes.RBACEventStoreFactory, relic.web3, accounts[0]),
    default: await Factory.create(Factory.FactoryTypes.EventStoreFactory, relic.web3, accounts[0])
  };

  let storeInstances = {
    unsafe: await Factory.createStore(factoryInstances.unsafe, adapter, relic.web3, accounts[0]),
    rbac: await Factory.createStore(factoryInstances.rbac, adapter, relic.web3, accounts[0]),
    // default: await Factory.createStore(factoryInstances.default, adapter, relic.web3, accounts[0])
  };

  return {
    relic,

    factoryInstances,
    storeInstances,
    adapter,
    accounts,

    store: storeInstances.unsafe,
    factory: factoryInstances.unsafe,

    nodeStorageReadModelAdapter
  };
};

import { getSetupAsync } from "../../__mocks__/setup";
import { Factory } from "../Factory";

import { W3 } from "soltsice";

/**
 * Factory test
 */
describe("Factory.getReadModel", () => {
  const factoryTypes: any = {
    // UnsafeEventStoreFactory: Factory.Types.UnsafeEventStoreFactory,
    RBACEventStoreFactory: Factory.FactoryTypes.RBACEventStoreFactory
  };

  const Storage = require("node-storage");
  const db = new Storage("./read_model_storage");
  const factoryReadModelAdapter: any = {
    getItem: (id: string) => {
      return JSON.parse(db.get(id));
    },
    setItem: (id: string, value: any) => {
      return db.put(id, JSON.stringify(value));
    }
  };

  Object.keys(factoryTypes).map(typeString => {
    it(typeString, async () => {
      let { relic, storeInstances, accounts, adapter } = await getSetupAsync();

      // console.log(storeInstances)

      // console.log(factoryInstances);
      // let rm = await Factory.getReadModel(factory, adapter, relic.web3, accounts[0]);
      // console.log("get the read model!!!!", rm);
      // expect(await inst.owner()).toBe(accounts[0]);
    });
  });
});

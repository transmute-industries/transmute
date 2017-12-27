import { getSetupAsync } from "../../Store/__mocks___/store";
import { Factory } from "../Factory";

import { W3 } from "soltsice";

/**
 * Factory test
 */
describe("Factory", () => {
  const factoryTypes: any = {
    // UnsafeEventStoreFactory: Factory.Types.UnsafeEventStoreFactory,
    RBACEventStoreFactory: Factory.Types.RBACEventStoreFactory
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
    it("Factory.getReadModel " + typeString, async () => {
      let { relic, accounts, factory, adapter } = await getSetupAsync();
      let rm = await Factory.getReadModel(factory, adapter, relic.web3, accounts[0]);
      console.log("get the read model!!!!", rm);
      // expect(await inst.owner()).toBe(accounts[0]);
    });
  });
});

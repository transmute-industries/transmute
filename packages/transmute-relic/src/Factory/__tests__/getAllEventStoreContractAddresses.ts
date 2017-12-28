import { getSetupAsync } from "../../__mocks__/setup";
import { Factory } from "../Factory";

import { W3 } from "soltsice";

/**
 * Factory test
 */
describe("Factory.getAllEventStoreContractAddresses", () => {
  const factoryTypes: any = {
    // UnsafeEventStoreFactory: Factory.Types.UnsafeEventStoreFactory,
    RBACEventStoreFactory: Factory.FactoryTypes.RBACEventStoreFactory
  };

  Object.keys(factoryTypes).map(typeString => {
    it(typeString, async () => {
      let { relic, factoryInstances, accounts, adapter } = await getSetupAsync();
      let addresses = await Factory.getAllEventStoreContractAddresses(
        factoryInstances.unsafe,
        accounts[0]
      );
      expect(addresses.length).toBe(1);
    });
  });
});

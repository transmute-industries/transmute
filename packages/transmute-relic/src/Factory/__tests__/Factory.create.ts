import { getSetupAsync } from "../../Store/__mocks___/store";
import { Factory } from "../Factory";

import { W3} from 'soltsice'

/**
 * Factory test
 */
describe("Factory", () => {
  const factoryTypes: any = {
    UnsafeEventStoreFactory: Factory.Types.UnsafeEventStoreFactory,
    RBACEventStoreFactory: Factory.Types.RBACEventStoreFactory
  };

  Object.keys(factoryTypes).map(typeString => {
    it("Factory.create " + typeString, async () => {
      let { relic, accounts } = await getSetupAsync();
      const inst = await Factory.create(factoryTypes[typeString], relic.web3, accounts[0]);
      expect(await inst.owner()).toBe(accounts[0]);
    });
  });
});

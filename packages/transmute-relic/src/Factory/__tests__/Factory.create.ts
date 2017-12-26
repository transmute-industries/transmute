import { getSetupAsync } from "../../Store/__mocks___/store";
import { Factory } from "../Factory";

/**
 * Factory test
 */
describe("Factory", () => {
  const factoryTypes: any = { UnsafeEventStoreFactory: Factory.Types.UnsafeEventStoreFactory };

  Object.keys(factoryTypes).map(typeString => {
    it("Factory.create " + typeString, async () => {
      let { relic, accounts } = await getSetupAsync();
      const inst = await Factory.create(factoryTypes[typeString], relic.web3, accounts[0]);
      expect(await inst.creator()).toBe(accounts[0]);
    });
  });
});

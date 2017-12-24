import Relic from "../../transmute-relic";
import { Factory } from "../Factory";

/**
 * Factory test
 */
describe("Factory", () => {
  const cfg = {
    providerUrl: "http://localhost:8545"
  };

  it("Factory is defined", () => {
    expect(Factory).toBeDefined();
  });

  const factoryTypes: any = { UnsafeEventStoreFactory: Factory.Types.UnsafeEventStoreFactory };

  let relic: Relic;
  let accounts: string[];

  beforeAll(async () => {
    relic = new Relic(cfg);
    accounts = await relic.getAccounts();
  });

  describe("create returns an instance for all factory types", () => {
    Object.keys(factoryTypes).map(typeString => {
      it("create returns an instance " + typeString, async () => {
        const inst = await Factory.create(factoryTypes[typeString], relic.web3, accounts[0]);
        expect(await inst.creator()).toBe(accounts[0]);
      });
    });
  });


});

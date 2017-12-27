import { getSetupAsync } from "../../__mocks__/setup";
import { Factory } from "../Factory";

import { W3 } from "soltsice";

/**
 * Factory test
 */
describe("Factory", () => {
  it("Factory.create ", async () => {
    let { factoryInstances } = await getSetupAsync();
    expect(factoryInstances.unsafe).toBeDefined();
    expect(factoryInstances.rbac).toBeDefined();
    expect(factoryInstances.default).toBeDefined();
  });
});

import { getSetupAsync } from "../Store/__mocks___/store";

/**
 * web3 tests
 */
describe("web3 tests", () => {
  let setup: any;

  beforeAll(async () => {
    setup = await getSetupAsync();
  });

  it("getSetupAsync provides accounts...", async () => {
    let { accounts } = setup;
    expect(accounts.length).toBe(10);
  });

});

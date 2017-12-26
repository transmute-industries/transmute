// import { Store } from "../../Store";
import { getSetupAsync } from "../../Store/__mocks___/store";

/**
 * Permissions throws on bad events
 */
describe("Permissions throws on bad events", () => {
  let setup: any;

  beforeAll(async () => {
    setup = await getSetupAsync();
  });

  it("permissions are cool", async () => {
    expect(true);
  });
});

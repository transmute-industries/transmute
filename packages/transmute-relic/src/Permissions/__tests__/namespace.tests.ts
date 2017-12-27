// import { Store } from "../../Store";
import { getSetupAsync } from "../../__mocks__/setup";

/**
 * Permissions throws on bad events
 */
describe("Permissions throws on bad events", () => {
  let setup: any;

  beforeAll(async () => {
    setup = await getSetupAsync();
  });

  it("permissions are cool", async () => {
    let { factory } = setup;

    // console.log(factory)

    expect(true);
  });
});

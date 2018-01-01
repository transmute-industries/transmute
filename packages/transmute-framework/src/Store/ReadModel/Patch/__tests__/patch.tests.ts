import { Patch } from "../Patch";
import states from "../../Logic/__mocks__/states";

/**
 * Patch tests
 */
describe("Patch event tests", () => {
  it("statesToPatches computes a patch for each state change", () => {
    let patches = Patch.statesToPatches(states);
    expect(patches.length).toBe(3);
  });

  it("statesToPatches computes a patch for each state change", () => {
    let patches = Patch.statesToPatches(states);
    let reconstructed1 = Patch.applyPatches(states[0], [patches[0]]);
    expect(reconstructed1).toEqual(states[1]);
    let reconstructed2 = Patch.applyPatches(reconstructed1, [patches[1]]);
    expect(reconstructed2).toEqual(states[2]);
  });
});

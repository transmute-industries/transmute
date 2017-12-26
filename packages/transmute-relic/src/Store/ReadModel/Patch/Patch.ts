const jiff = require("jiff");

export namespace Patch {

  export const statesToPatches = (states: any[]): any[] => {
    let patches: any[] = [];
    for (let i = 0; i <= states.length - 2; i++) {
      patches.push(jiff.diff(states[i], states[i + 1]));
    }
    return patches;
  };

  export const applyPatches = (state: any, patches: any) => {
    let patched = JSON.parse(JSON.stringify(state)); // deep copy
    patches.forEach((patch: any) => {
      patched = jiff.patchInPlace(patch, patched);
    });
    return patched;
  };
}

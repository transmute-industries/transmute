import * as Constants from "./constants";

export const transmuteInit = (accounts, factoryState, packageManagerState) => {
  return {
    type: Constants.TRANSMUTE_INIT,
    payload: {
      factoryState,
      packageManagerState,
      accounts
    }
  };
};

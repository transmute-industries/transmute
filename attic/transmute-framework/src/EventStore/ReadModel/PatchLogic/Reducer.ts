import TransmuteFramework from "../../../transmute-framework";

export const readModel = {
  readModelStoreKey: "", // readModelType:contractAddress
  readModelType: "PatchLogic",
  contractAddress: "0x0000000000000000000000000000000000000000",
  lastEvent: null, // Last Event Index Processed
  model: {} // where all the updates from events will be made
};

const updatesFromMeta = (meta: any) => {
  return {
    lastEvent: meta.id
  };
};

const handlers = {
  ["IPLD_PATCH"]: (state, action) => {
    // console.log('!!!! ' , action.payload.patch)
    let updatesToModel = {
      model: TransmuteFramework.TransmuteIpfs.patch(
        state.model,
        action.payload.patch
      )
    };
    let updatesToMeta = updatesFromMeta(action.meta);
    return Object.assign({}, state, updatesToModel, updatesToMeta);
  }
};

export const reducer = (state = readModel, action) => {
  return handlers[action.type](state, action);
};

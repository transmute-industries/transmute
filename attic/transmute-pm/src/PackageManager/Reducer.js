export const readModel = {
  readModelStoreKey: "", // readModelType:contractAddress
  readModelType: "PackageMangager",
  contractAddress: "0x0000000000000000000000000000000000000000",
  lastEvent: null, // Last Event Index Processed
  model: {} // where all the updates from events will be made
};

const updatesFromMeta = meta => {
  return {
    lastEvent: meta.id
  };
};

const handlers = {
  "PACKAGE_PUBLISHED": (state, action) => {
    let { name, version } = action.payload;
    let updatesToModel = {
      model: {
        ...state.model,
        [action.payload.ipfs[action.payload.ipfs.length - 1].hash]: {
          name,
          version
        }
      }
    };
    let updatesToMeta = updatesFromMeta(action.meta);
    return {
      ...state,
      ...updatesToModel,
      ...updatesToMeta
    };
  }
};

export const reducer = (state = readModel, action) => {
  return handlers[action.type](state, action);
};

import * as Constants from "./constants";

export const initialState = {
  readModelStoreKey: "", // readModelType:contractAddress
  readModelType: "MockReadModel",
  contractAddress: "0x0000000000000000000000000000000000000000",
  lastEvent: null, // Last Event Index Processed
  model: {} // where all the updates from events will be made
};

const updatesFromMeta = (meta: any) => {
  return {
    lastEvent: meta.id
  };
};

export const handlers: any = {
  [Constants.ACCOUNT_CREATED]: (state: any, action: any) => {
    return {
      ...state,
      model: {
        ...state.model,
        created: action.payload.timestamp
      },
      ...updatesFromMeta(action.meta)
    };
  },
  [Constants.ACCOUNT_NAMED]: (state: any, action: any) => {
    return {
      ...state,
      model: {
        ...state.model,
        name: action.payload.name
      },
      ...updatesFromMeta(action.meta)
    };
  }
};

export const reducer = (state: any, action: any) => {
  if (handlers[action.type]) {
    return handlers[action.type](state, action);
  }
  return state;
};

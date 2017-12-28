import * as Constants from "./constants";

export const initialState = {
  readModelStoreKey: "", // readModelType:contractAddress
  readModelType: "Permissions",
  contractAddress: "0x0000000000000000000000000000000000000000",
  lastEvent: null, // Last Event Index Processed
  model: {} // where all the updates from events will be made
};

const updatesFromMeta = (meta: any) => {
  return {
    lastEvent: meta.id
  };
};

const maybeInitialize = (state: any, action: any) => {
  if (!state.model[action.payload.grant.role]) {
    state.model[action.payload.grant.role] = {};
  }
  if (!state.model[action.payload.grant.role][action.payload.grant.resource]) {
    state.model[action.payload.grant.role][action.payload.grant.resource] = {};
  }
  if (
    !state.model[action.payload.grant.role][action.payload.grant.resource][
      action.payload.grant.action
    ]
  ) {
    state.model[action.payload.grant.role][action.payload.grant.resource][
      action.payload.grant.action
    ] =
      action.payload.grant.attributes;
  }
  return state;
};

export const handlers: any = {
  [Constants.AC_ROLE_ASSIGNED]: (state: any, action: any) => {
    console.log("what about this1: ", action);
    return {
      ...state,
      model: {
        ...state.model
        // maybe make a directory here....
      },
      ...updatesFromMeta(action.meta)
    };
  },
  [Constants.AC_GRANT_WRITTEN]: (state: any, action: any) => {
    console.log("what about this2: ", action);
    maybeInitialize(state, action);
    return {
      ...state,
      model: {
        ...state.model,
        [action.payload.grant.role]: {
          [action.payload.grant.resource]: {
            [action.payload.grant.action]: action.payload.grant.attributes,
            ...state.model[action.payload.grant.role][action.payload.grant.resource][
              action.payload.grant.action
            ]
          },
          ...state.model[action.payload.grant.role][action.payload.grant.resource]
        }
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

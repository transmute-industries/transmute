// import TransmuteFramework from '../../transmute-framework'

export const readModel = {
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

const handlers = {
  // For now we are not tracking this is read model...
  ["AC_ROLE_ASSIGNED"]: (state, action) => {
    let updatesToModel = {
      model: {}
    };
    let updatesToMeta = updatesFromMeta(action.meta);
    return Object.assign({}, state, updatesToModel, updatesToMeta);
  },
  ["AC_GRANT_WRITTEN"]: (state, action) => {
    if (!state.model[action.payload.grant.role]) {
      state.model[action.payload.grant.role] = {};
    }
    if (
      !state.model[action.payload.grant.role][action.payload.grant.resource]
    ) {
      state.model[action.payload.grant.role][
        action.payload.grant.resource
      ] = {};
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
    // console.log(action.payload.grant.attributes)
    let updatesToModel = {
      model: {
        [action.payload.grant.role]: {
          [action.payload.grant.resource]: {
            [action.payload.grant.action]: action.payload.grant.attributes,
            ...state.model[action.payload.grant.role][
              action.payload.grant.resource
            ][action.payload.grant.action]
          },
          ...state.model[action.payload.grant.role][
            action.payload.grant.resource
          ]
        },
        ...state.model
      }
    };
    // console.log(action.payload.grant)
    let updatesToMeta = updatesFromMeta(action.meta);
    return Object.assign({}, state, updatesToModel, updatesToMeta);
  }
};

export const reducer = (state = readModel, action) => {
  // console.log(action)
  if (handlers[action.type]) {
    return handlers[action.type](state, action);
  }
  return state;
};

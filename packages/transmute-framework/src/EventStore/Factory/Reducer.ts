// import TransmuteFramework from '../../transmute-framework'

export const readModel = {
  readModelStoreKey: '', // readModelType:contractAddress
  readModelType: 'RBACFactory',
  contractAddress: '0x0000000000000000000000000000000000000000',
  lastEvent: null, // Last Event Index Processed
  model: {}, // where all the updates from events will be made
}

const updatesFromMeta = (meta: any) => {
  return {
    lastEvent: meta.id,
  }
}

const handlers = {
  ['ES_CREATED']: (state, action) => {
    let updatesToModel = {
      model: {
        [action.payload.address]: {
          created: action.meta.created,
          owner: action.meta.txOrigin,
        },
        ...state.model,
      },
    }
    let updatesToMeta = updatesFromMeta(action.meta)
    return Object.assign({}, state, updatesToModel, updatesToMeta)
  },
}

export const reducer = (state = readModel, action) => {
  // console.log(action)
  if (handlers[action.type]) {
    return handlers[action.type](state, action)
  }
  return state
}

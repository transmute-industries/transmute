import { InternalEventTypes } from '../../transmute-framework'

export const initialState = {
  readModelStoreKey: '', // readModelType:contractAddress
  readModelType: 'PackageManager',
  contractAddress: '0x0000000000000000000000000000000000000000',
  lastEvent: null, // Last Event Index Processed
  model: {} // where all the updates from events will be made,
}

const updatesFromMeta = (meta: any) => {
  return {
    lastEvent: meta.id
  }
}

const updatesFromAdapterMeta = (state, meta: any) => {
  state.model.adapterMeta = state.model.adapterMeta || {}
  state.model.adapterMeta[meta.valueType] = state.model.adapterMeta[meta.valueType] || {
    cumulativeEventSize: 0,
    cumulativePackageSize: 0,
    allRefs: []
  }

  state.model.adapterMeta[meta.valueType].cumulativeEventSize += meta.adapterMeta.eventSize
  state.model.adapterMeta[meta.valueType].cumulativePackageSize += meta.adapterMeta.pacakgeSize

  // TERRIBLE TERRIBLE !!!!!! TERRIBLE
  // storing all event refs in the read model is totally unacceptable for anything,
  // except maybe a package manager...
  if (state.model.adapterMeta[meta.valueType].allRefs.indexOf(meta.adapterMeta.eventHash) === -1) {
    state.model.adapterMeta[meta.valueType].allRefs.push(meta.adapterMeta.eventHash)
  }
  if (
    state.model.adapterMeta[meta.valueType].allRefs.indexOf(meta.adapterMeta.packageHash) === -1
  ) {
    state.model.adapterMeta[meta.valueType].allRefs.push(meta.adapterMeta.packageHash)
  }
  return state.model.adapterMeta
}

const handlers: any = {
  [InternalEventTypes.NEW_OWNER]: (state: any, action: any) => {
    // console.log(action);
    return {
      ...state,
      model: {
        ...state.model,
        owner: action.payload.value
      },
      ...updatesFromMeta(action.meta)
    }
  },
  [InternalEventTypes.WL_SET]: (state: any, action: any) => {
    // console.log(action);
    return {
      ...state,
      model: {
        ...state.model,
        whitelisted: true
      },
      ...updatesFromMeta(action.meta)
    }
  },
  PACKAGE_UPDATED: (state: any, action: any) => {
    // console.log(action.meta.adapterMeta)
    // make sure to settle object before returning it.
    let newState = {
      ...state,
      model: {
        ...state.model,
        [action.payload.name]: {
          ...state.model[action.payload.name],
          version: action.payload.version,
          multihash: action.payload.multihash
        },
        adapterMeta: updatesFromAdapterMeta(state, action.meta)
      },
      ...updatesFromMeta(action.meta)
    }
    return newState
  }
}

export const reducer = (state: any, action: any) => {
  if (handlers[action.type]) {
    state = handlers[action.type](state, action)
  }
  return state
}

import { InternalEventTypes } from '../../transmute-framework'

let globalIPFS

let getStat = mhash => {
  return new Promise((resolve, reject) => {
    globalIPFS.stat(mhash, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

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

const updateAdapterMeta = async (state, action: any) => {
  state.model.adapterMeta = state.model.adapterMeta || {}
  state.model.adapterMeta[action.meta.valueType] = state.model.adapterMeta[
    action.meta.valueType
  ] || {
    cumulativeEventSize: 0,
    cumulativePackageSize: 0,
    allRefs: []
  }

  let eventMultihash = action.meta.adapterPayload.value
  let eventStat: any = await getStat(eventMultihash)
  let newCumulativeEventSize =
    state.model.adapterMeta[action.meta.valueType].cumulativeEventSize + eventStat.CumulativeSize
  // console.log("some adapter events have hashs inside.. count them too");
  let packageStat: any = await getStat(action.payload.multihash)
  let newCumulativePacakgeSize =
    state.model.adapterMeta[action.meta.valueType].cumulativePackageSize +
    packageStat.CumulativeSize

  // TERRIBLE TERRIBLE !!!!!! TERRIBLE
  // storing all event refs in the read model is totally unacceptable for anything,
  // except maybe a package manager...
  if (state.model.adapterMeta[action.meta.valueType].allRefs.indexOf(eventMultihash) === -1) {
    state.model.adapterMeta[action.meta.valueType].allRefs.push(eventMultihash)
  }
  if (
    state.model.adapterMeta[action.meta.valueType].allRefs.indexOf(action.payload.multihash) === -1
  ) {
    state.model.adapterMeta[action.meta.valueType].allRefs.push(action.payload.multihash)
  }

  return {
    ...state.model.adapterMeta,
    [action.meta.valueType]: {
      ...state.model.adapterMeta[action.meta.valueType],
      cumulativeEventSize: newCumulativeEventSize,
      cumulativePackageSize: newCumulativePacakgeSize
    }
  }
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
  PACKAGE_UPDATED: async (state: any, action: any) => {
    // console.log(action);
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
        adapterMeta: await updateAdapterMeta(state, action)
      },
      ...updatesFromMeta(action.meta)
    }
    return newState
  }
}

export const reducer = async (state: any, action: any) => {
  if (handlers[action.type]) {
    state = await handlers[action.type](state, action)
  }
  return state
}

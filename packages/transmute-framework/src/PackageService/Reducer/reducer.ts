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

const calculateCostFromRefs = (refs: any) => {
  let keys = Object.keys(refs)
  let size = 0
  keys.forEach(key => {
    size += refs[key]
  })
  return size
}

const handlePackageUpdate = (state, action: any) => {
  const meta = action.meta
  state.model.adapterMeta = state.model.adapterMeta || {}
  state.model.adapterMeta[meta.valueType] = state.model.adapterMeta[
    meta.valueType
  ] || {
    eventRefs: {},
    cumulativeEventSize: 0,
    packageRefs: {},
    cumulativePackageSize: 0
  }
  const thisEventAdapterMeta = state.model.adapterMeta[meta.valueType]
  const eventRefs = thisEventAdapterMeta.eventRefs
  const packageRefs = thisEventAdapterMeta.packageRefs
  const eventRef = meta.adapterMeta.eventHash
  const eventSize = meta.adapterMeta.eventSize
  const packageRef = meta.adapterMeta.packageHash
  const packageSize = meta.adapterMeta.packageSize
  eventRefs[eventRef] = eventSize
  packageRefs[packageRef] = packageSize
  state.model[packageRef] = action.payload.name
  thisEventAdapterMeta.cumulativeEventSize = calculateCostFromRefs(eventRefs)
  thisEventAdapterMeta.cumulativePackageSize = calculateCostFromRefs(
    packageRefs
  )
  return state.model
}

const handlePackageDelete = (state, action: any) => {
  const meta = action.meta
  state.model.adapterMeta = state.model.adapterMeta

  const thisEventAdapterMeta = state.model.adapterMeta[meta.valueType]
  const eventRefs = state.model.adapterMeta[meta.valueType].eventRefs
  const packageRefs = state.model.adapterMeta[meta.valueType].packageRefs

  const eventRef = meta.adapterMeta.eventHash
  const eventSize = meta.adapterMeta.eventSize
  eventRefs[eventRef] = eventSize

  const packageRef = meta.adapterMeta.packageHash
  delete packageRefs[packageRef]
  delete state.model[packageRef]

  thisEventAdapterMeta.cumulativeEventSize = calculateCostFromRefs(eventRefs)
  thisEventAdapterMeta.cumulativePackageSize = calculateCostFromRefs(
    packageRefs
  )

  return state.model
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
    // console.log('delets seem bust ', action)
    // make sure to settle object before returning it.
    let newState = {
      ...state,
      model: handlePackageUpdate(state, action),
      ...updatesFromMeta(action.meta)
    }
    return newState
  },
  PACKAGE_DELETED: (state: any, action: any) => {
    // make sure to settle object before returning it.
    // console.log("package deleted events must be interceptor so that meta can be extracted...");
    // console.log(action.meta);
    let newState = {
      ...state,
      model: handlePackageDelete(state, action),
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

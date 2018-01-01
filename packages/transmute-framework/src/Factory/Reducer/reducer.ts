import * as InternalEventTypes from '../../Store/Events/InternalEventTypes'

export const initialState = {
  readModelStoreKey: '', // readModelType:contractAddress
  readModelType: 'EventStoreFactory',
  contractAddress: '0x0000000000000000000000000000000000000000',
  lastEvent: null, // Last Event Index Processed
  model: {} // where all the updates from events will be made
}

const updatesFromMeta = (meta: any) => {
  return {
    lastEvent: meta.id
  }
}

export const handlers: any = {
  [InternalEventTypes.ES_CREATED]: (state: any, action: any) => {
    // console.log(action)
    return {
      ...state,
      model: {
        ...state.model,
        [action.payload.address]: {
          created: action.meta.created,
          owner: action.meta.txOrigin
        }
      },
      ...updatesFromMeta(action.meta)
    }
  }
}

export const reducer = (state: any, action: any) => {
  if (handlers[action.type]) {
    return handlers[action.type](state, action)
  }
  return state
}

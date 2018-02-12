const getReadModel = (T, eventStoreAddress, readModelAdapter) => {
  const initialState = {
    readModelStoreKey: "", // readModelType:contractAddress
    readModelType: "EventStore",
    contractAddress: "0x0000000000000000000000000000000000000000",
    lastEvent: null, // Last Event Index Processed
    model: {} // where all the updates from events will be made
  };

  const reducer = (state, action) => {
    const updatesFromMeta = meta => {
      return {
        lastEvent: meta.id
      };
    };
    const handlers = {
      [T.InternalEventTypes.WL_SET]: (state, action) => {
        // console.log(action);
        return {
          ...state,
          model: {
            ...state.model,
            whitelistLastSetBy: action.payload.value
          },
          ...updatesFromMeta(action.meta)
        };
      },
      INTEGRITY_CHECKPOINT: (state, action) => {
        // console.log(action);
        return {
          ...state,
          model: {
            ...state.model,
            lastIntegrityCheckpoint: action.payload
          },
          ...updatesFromMeta(action.meta)
        };
      },
      JWT_SIGNATURE: (state, action) => {
        // console.log(action);
        return {
          ...state,
          model: {
            ...state.model,
            lastJwtSignature: action.payload
          },
          ...updatesFromMeta(action.meta)
        };
      }
    };
    if (handlers[action.type]) {
      return handlers[action.type](state, action);
    }
    return state;
  };

  initialState.contractAddress = eventStoreAddress;
  initialState.readModelStoreKey = `${
    initialState.readModelType
  }:${eventStoreAddress}`;

  let readModel = new T.ReadModel(readModelAdapter, reducer, initialState, []);

  return readModel;
};

module.exports = getReadModel;

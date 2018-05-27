import * as Constants from './constants';

export default (state, event) => {
  switch (event.value.type) {
    case Constants.SIGNATURE_CREATED: {
      return {
        ...state,
        signatures: {
          ...state.signatures,
          [event.sender]: { 'name': event.value.name, 'hash': event.value.hash }
        }
      }
    }
    case Constants.DOCUMENT_CREATED: {
      return {
        ...state,
        documents: { ...(state.documents || {}), [event.value.hash]: { 'name': event.value.name, 'signatures': [] } }
      }
    }
    case Constants.DOCUMENT_SIGNED: {
      return {
        ...state,
        documents: {
          ...state.documents,
          [event.key.id]: {
            ...state.documents[event.key.id],
            'signatures': [...(state.documents[event.key.id] != null ? state.documents[event.key.id].signatures : []), event.value.hash]
          }
        }
      }
    }
    default: {
      return state;
    }
  }
};
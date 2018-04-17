import * as Constants from './constants';

export const reducer = (state, event) => {
  switch (event.value.type) {
    case Constants.SIGNATURE_ADDED:
    case Constants.SIGNATURE_CREATED: {
      return {
        ...state,
        signatures: {
          ...state.signatures,
          [event.sender]: event.value.hash
        }
      }
    }
    case Constants.DOCUMENT_CREATED: {
      return {
        ...state,
        documents: { ...(state.documents || {}), [event.value.hash]: { 'signatures': [] } }
      }
    }
    case Constants.DOCUMENT_SIGNED: {
      return {
        ...state,
        documents: {
          ...state.documents,
          [event.value.hash]: {
            ...state.documents[event.value.hash],
            'signatures': [...state.documents[event.value.hash].signatures, event.value.hash]
          }
        }
      }
    }
  }
};
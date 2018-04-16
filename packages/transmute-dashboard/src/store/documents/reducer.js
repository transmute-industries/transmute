import * as Constants from './constants';

export const reducer = (state, event) => {
  switch (event.value.type) {
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
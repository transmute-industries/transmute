import * as Constants from "./constants";

const handlers = {
  [Constants.TOAST_MESSAGE]: (state, action) => {
    var snackbarContainer = document.querySelector("#demo-toast-example");
    snackbarContainer.MaterialSnackbar.showSnackbar(action.payload);
    return {
      ...action.payload
    };
  }
};

export const initialState = {
  message: ""
};

export const reducer = (state = initialState, action) => {
  return handlers[action.type] ? handlers[action.type](state, action) : state;
};

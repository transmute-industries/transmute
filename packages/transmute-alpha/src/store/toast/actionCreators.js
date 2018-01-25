import * as Constants from "./constants";

export const toastMessage = message => {
  return {
    type: Constants.TOAST_MESSAGE,
    payload: {
      message
    }
  };
};

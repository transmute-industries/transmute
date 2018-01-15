import * as Constants from "./constants";

export const updateSearch = text => {
  return {
    type: Constants.SEARCH_UPDATE,
    payload: {
      fetching: false,
      text
    }
  };
};

export const submitSearch = text => {
  return {
    type: Constants.SEARCH_SUBMIT,
    payload: {
      fetching: true,
      text
    }
  };
};

export const onSearchResults = results => {
  return {
    type: Constants.SEARCH_RESULTS,
    payload: {
      fetching: false,
      results
    }
  };
};

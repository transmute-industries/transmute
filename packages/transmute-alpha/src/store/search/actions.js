import * as middleware from "./middleware";
import * as actionCreators from "./actionCreators";

export const getSearchResults = async text => {
  let results = await middleware.getSearchResults(text);
  return actionCreators.onSearchResults(results);
};

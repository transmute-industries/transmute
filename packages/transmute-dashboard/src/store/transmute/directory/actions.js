import * as actionCreators from './actionCreators';
import * as middleware from './middleware';

export const loadDirectory = () => {
  return async dispatch => {
    const profiles = await middleware.getDirectoryProfiles();
    dispatch(actionCreators.loadDirectory(profiles));
  };
};

export const loadDirectoryProfile = id => {
  return async dispatch => {
    const profile = await middleware.getDirectoryProfile(id);
    dispatch(actionCreators.loadDirectoryProfile(profile));
  };
};

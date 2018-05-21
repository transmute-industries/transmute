import * as Constants from './constants';

export const loadDirectory = profiles => {
  return {
    type: Constants.DIRECTORY_LOADED,
    payload: {
      profiles
    }
  };
};

export const loadDirectoryProfile = profile => {
  return {
    type: Constants.DIRECTORY_PROFILE_LOADED,
    payload: {
      profile
    }
  };
};

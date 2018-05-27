import * as actionCreators from './actionCreators';
import * as middleware from './middleware';

export const loadGroup = (auth, groupId) => {
  return async dispatch => {
    const group = await middleware.getGroup(auth, groupId);
    dispatch(actionCreators.loadGroup(group));
  };
};

export const loadGroups = (auth) => {
  return async dispatch => {
    const groups = await middleware.getGroups(auth);
    dispatch(actionCreators.loadGroups(groups));
  };
};

export const createGroup = (auth, profile) => {
  return async dispatch => {
    await middleware.createGroup(auth, profile);
    const groups = await middleware.getGroups(auth);
    dispatch(actionCreators.loadGroups(groups));
  };
};

export const setGroupProfile = (auth, groupId, profile) => {
  return async dispatch => {
    const group = await middleware.setGroupProfile(auth, groupId, profile);
    dispatch(actionCreators.loadGroupProfile(group));
  };
};

export const deleteGroup = (auth, groupId) => {
  return async dispatch => {
    await middleware.deleteGroup(auth, groupId);
    const groups = await middleware.getGroups(auth);
    dispatch(actionCreators.loadGroups(groups));
  };
};

export const loadGroupMembers = (auth, groupId) => {
  return async dispatch => {
    const members = await middleware.getGroupMembers(auth, groupId);
    dispatch(actionCreators.loadGroupMembers(groupId, members));
  };
};

export const addGroupMember = (auth, groupId, userId) => {
  return async dispatch => {
    await middleware.addGroupMember(auth, groupId, userId);
    const members = await middleware.getGroupMembers(auth, groupId);
    dispatch(actionCreators.loadGroupMembers(groupId, members));
  };
};

export const removeGroupMember = (auth, groupId, userId) => {
  return async dispatch => {
    await middleware.removeGroupMember(auth, groupId, userId);
    const members = await middleware.getGroupMembers(auth, groupId);
    dispatch(actionCreators.loadGroupMembers(groupId, members));
  };
};

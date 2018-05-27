import * as Constants from './constants';

export const loadGroup = group => {
  return {
    type: Constants.GROUP_LOADED,
    payload: {
      group
    }
  };
};

export const loadGroupProfile = group => {
  return {
    type: Constants.GROUP_PROFILE_LOADED,
    payload: {
      group
    }
  };
};

export const loadGroups = groups => {
  return {
    type: Constants.GROUPS_LOADED,
    payload: {
      groups
    }
  };
};

export const groupDeleted = groupId => {
  return {
    type: Constants.GROUP_DELETED,
    payload: {
      groupId
    }
  };
};

export const loadGroupMembers = (groupId, members) => {
  return {
    type: Constants.GROUP_MEMBERS_LOADED,
    payload: {
      groupId, 
      members
    }
  };
};

export const groupMemberAdded = (groupId, userId) => {
  return {
    type: Constants.GROUP_MEMBER_ADDED,
    payload: {
      groupId, 
      userId
    }
  };
};

export const groupMemberRemoved = (groupId, userId) => {
  return {
    type: Constants.GROUP_MEMBER_REMOVED,
    payload: {
      groupId, 
      userId
    }
  };
};
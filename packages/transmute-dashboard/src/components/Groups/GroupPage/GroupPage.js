import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withAuth } from '@okta/okta-react';
import { withStyles } from 'material-ui/styles';

import AppBar from '../../AppBar';
import GroupTable from './GroupTable';
import EditGroupCard from './EditGroupCard';

import { history } from '../../../store';
import directory from '../../../store/transmute/directory';
import groups from '../../../store/transmute/groups';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit
  },
  formControl: {
    minWidth: '600px'
  }
});

class GroupPage extends Component {
  componentWillMount() {
    if (!this.props.groups.selectedGroup) {
      this.updateGroup();
      this.props.actions.directory.loadDirectory();
    }
  }

  updateGroup = async () => {
    const group_id = window.location.href
      .split('groups/')[1]
      .split('?')[0];
    this.props.actions.groups.loadGroup(this.props.auth, group_id);
    this.props.actions.groups.loadGroupMembers(this.props.auth, group_id);
  };

  onDelete = async () => {
    await this.props.actions.groups.deleteGroup(this.props.auth, this.props.groups.selectedGroup.id);
    history.push('/groups');
  };

  onSave = async (profile) => {
    await this.props.actions.groups.setGroupProfile(this.props.auth, this.props.groups.selectedGroup.id, profile);
  };

  onAddMember = async (userId) => {
    await this.props.actions.groups.addGroupMember(this.props.auth, this.props.groups.selectedGroup.id, userId);
  };

  onRemoveMember = async (userId) => {
    await this.props.actions.groups.removeGroupMember(this.props.auth, this.props.groups.selectedGroup.id, userId);
  };

  render() {
    const { groups, directory } = this.props;

    return (
      <AppBar>
        <EditGroupCard
          onDelete={this.onDelete}
          onSave={this.onSave}
          onAddMember={this.onAddMember}
          onRemoveMember={this.onRemoveMember}
          group={groups.selectedGroup}
          users={directory.profiles}
        />
        <GroupTable group={groups.selectedGroup} />
      </AppBar>
    );
  }
}

const mapStateToProps = state => {
  return {
    directory: state.directory,
    groups: state.groups
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      directory: bindActionCreators(directory.actions, dispatch),
      groups: bindActionCreators(groups.actions, dispatch)
    }
  };
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(withAuth(GroupPage))
);
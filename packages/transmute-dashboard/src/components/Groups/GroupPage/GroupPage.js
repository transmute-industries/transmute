import React, { Component } from 'react';
import _ from 'lodash';
import { withAuth } from '@okta/okta-react';
import { withStyles } from 'material-ui/styles';

import AppBar from '../../AppBar';
import GroupTable from './GroupTable';
import EditGroupCard from './EditGroupCard';

import { getGroup, deleteGroup, getGroupMembers, addGroupMember, removeGroupMember, getDirectoryProfiles } from '../../../store/transmute/middleware';
import { history } from '../../../store';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit
  },
  formControl: {
    minWidth: '600px'
  }
});

class GroupPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      group: null,
      users: null,
      error: null
    };
  }

  async componentWillMount() {
    if (!this.state.group) {
      await this.updateGroup();
      const users = await getDirectoryProfiles(this.props.auth);
      this.setState({
        ...this.state,
        users
      });
    }
  }

  updateGroup = async () => {
    const group_id = window.location.href
      .split('groups/')[1]
      .split('?')[0];
    let group = await getGroup(this.props.auth, group_id);
    const members = await getGroupMembers(this.props.auth, group_id);
    group.members = members;
    this.setState({
      ...this.state,
      group
    });
  };

  onDelete = async () => {
    let response = await deleteGroup(this.props.auth, this.state.group.id);
    if (response.data.error) {
      // TODO: Handle error states in UI
      this.setState({
        error: response.data.error
      });
    } else {
      this.setState({
        error: null
      });
      history.push('/groups');
    }
  };

  onAddMember = async (userId) => {
    let response = await addGroupMember(this.props.auth, this.state.group.id, userId);
    if (response.data.error) {
      // TODO: Handle error states in UI
      this.setState({
        ...this.state,
        error: response.data.error
      });
    } else {
      this.setState({
        ...this.state,
        error: null
      });
      // TODO: Update Group Members in UI
    }
    await this.updateGroup();
  };

  onRemoveMember = async (userId) => {
    let response = await removeGroupMember(this.props.auth, this.state.group.id, userId);
    if (response.data.error) {
      // TODO: Handle error states in UI
      this.setState({
        ...this.state,
        error: response.data.error
      });
    } else {
      // TODO: Update Add / Remove Button in UI
      this.setState({
        ...this.state,
        error: null
      });
    }
    await this.updateGroup();
  };

  render() {
    return (
      <AppBar>
        { this.state.group && this.state.users &&
          <EditGroupCard
            onDelete={this.onDelete}
            onAddMember={this.onAddMember}
            onRemoveMember={this.onRemoveMember}
            group={this.state.group}
            users={this.state.users}
          />
        }
        { this.state.group && <GroupTable group={this.state.group} /> }
      </AppBar>
    );
  }
}

export default withStyles(styles)(withAuth(GroupPage));
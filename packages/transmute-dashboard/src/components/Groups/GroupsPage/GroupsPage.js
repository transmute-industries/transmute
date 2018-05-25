import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withAuth } from '@okta/okta-react';
import { withStyles } from 'material-ui/styles';

import withGroups from '../../../containers/withGroups';
import AppBar from '../../AppBar';
import GroupsTable from './GroupsTable';
import CreateGroupCard from './CreateGroupCard';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit
  },
  formControl: {
    minWidth: '600px'
  }
});

class GroupsPage extends Component {
  componentWillMount() {
    this.props.actions.groups.loadGroups(this.props.auth);
  }

  render() {
    const { groups } = this.props;
    return (
      <AppBar>
        <CreateGroupCard />
        <GroupsTable groups={groups.groups} />
      </AppBar>
    );
  }
}

export default withStyles(styles)(
  connect(null, null)(withAuth(withGroups(GroupsPage)))
);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withAuth } from '@okta/okta-react';
import { withStyles } from 'material-ui/styles';

import withDirectory from '../../../containers/withDirectory';

import AppBar from '../../AppBar';

import PublicDirectoryProfileCard from './PublicDirectoryProfileCard';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit
  },
  formControl: {
    minWidth: '600px'
  }
});

class DirectoryProfilePage extends Component {
  componentWillMount() {
    const profile_id = window.location.href
      .split('directory/')[1]
      .split('?')[0];

    this.props.actions.directory.loadDirectoryProfile(profile_id);
  }

  render() {
    const { directory } = this.props;
    if (!directory.profile) return null;
    return (
      <AppBar>
        <PublicDirectoryProfileCard profile={directory.profile} />
      </AppBar>
    );
  }
}

export default withStyles(styles)(
  connect(null, null)(withAuth(withDirectory(DirectoryProfilePage)))
);

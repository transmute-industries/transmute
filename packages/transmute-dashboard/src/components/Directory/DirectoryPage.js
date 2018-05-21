import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withAuth } from '@okta/okta-react';
import { withStyles } from 'material-ui/styles';

import withDirectory from '../../containers/withDirectory';

import AppBar from '../AppBar';
import DirectoryTable from './DirectoryTable';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit
  },
  formControl: {
    minWidth: '600px'
  }
});

class DirectoryPage extends Component {
  componentWillMount() {
    // provided by the withDirectory
    this.props.actions.directory.loadDirectory();
  }

  render() {
    const { directory } = this.props;
    return (
      <AppBar>
        <DirectoryTable people={directory.profiles} />
      </AppBar>
    );
  }
}

export default withStyles(styles)(
  connect(null, null)(withAuth(withDirectory(DirectoryPage)))
);

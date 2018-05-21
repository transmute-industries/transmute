import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withAuth } from '@okta/okta-react';
import { withStyles } from 'material-ui/styles';

import AppBar from '../AppBar';
import DirectoryTable from './DirectoryTable';

import { getDirectoryProfiles } from '../../store/transmute/middleware';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit
  },
  formControl: {
    minWidth: '600px'
  }
});

class DirectoryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profiles: null,
      error: null
    };
  }

  async componentWillMount() {
    if (!this.state.profiles) {
      const profiles = await getDirectoryProfiles(this.props.auth);
      this.setState({
        profiles
      });
    }
  }

  render() {
    const { profiles } = this.state;
    return (
      <AppBar>
        <DirectoryTable people={profiles} />
      </AppBar>
    );
  }
}

export default withStyles(styles)(connect(null, null)(withAuth(DirectoryPage)));

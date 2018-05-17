import React, { Component } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withAuth } from '@okta/okta-react';

import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';

import AppBar from '../AppBar';
import * as actionsCreators from '../../store/user/actionCreators';
import * as actions from '../../store/user/actions';
import { getUser } from '../../store/user/middleware';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
});

class AccountPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.setUserInfo(this.state.profile);
  }

  handleChange = name => event => {
    // TODO: need to set user state here
    this.state.profile[name] = event.target.value;
    console.log('this.state.profile: ', this.state.profile);
  };

  async componentWillMount() {
    if (!this.state.profile) {
      let response = await getUser(this.props.auth);
      let profile = response.data.profile;
      this.setState({
        profile
      });
    }
  }
  
  render() {
    if (!this.state.profile) return null;
    
    const { classes } = this.props;
    const { profile } = this.state;

    return (
      <AppBar>
        <h1>Account</h1>
        <pre>{JSON.stringify(profile, null, 2)}</pre>
        <div>
          <FormControl className={classNames(classes.margin)}>
            <InputLabel>First Name</InputLabel>
            <Input
              className={classNames(classes.textInput)}
              id="given-name"
              type="text"
              value={profile.firstName}
              onChange={this.handleChange('firstName')}
            />
          </FormControl>
          <FormControl className={classNames(classes.margin)}>
            <InputLabel>Last Name</InputLabel>
            <Input
              className={classNames(classes.textInput)}
              id="given-name"
              type="text"
              value={profile.lastName}
              onChange={this.handleChange('lastName')}
            />
          </FormControl>
        </div>
      </AppBar>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    go: () => dispatch(push('/protected')),
    setUserInfo: async oktaUser => {
      dispatch(actionsCreators.setUserInfo(oktaUser));
    },
    getUser: async auth => {
      dispatch(actions.getUser(auth));
    }
  };
};


export default withStyles(styles)(
  connect(null, mapDispatchToProps)(
    withAuth(AccountPage)
  )
);
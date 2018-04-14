import React, { Component } from 'react';

import classNames from 'classnames';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import { connect } from 'react-redux';

import logo from '../../images/transmute.logo.png';

import * as actions from '../../store/transmute/actions';

const styles = theme => ({
  root: {
    flexWrap: 'wrap',
    padding: '40px',
    textAlign: 'center'
  },
  logo: {
    maxWidth: '300px'
  },
  margin: {
    margin: theme.spacing.unit
  },
  textField: {
    // display: 'block',
    minWidth: '400px'
  },
  textInput: {
    // width: '100%'
  }
});

class Register extends Component {
  state = {
    error: null,
    email: 'bob@example.com',
    password: 'asdfasdf'
  };

  handleSubmit = e => {
    e.preventDefault();

    this.props.registerWithActivationEmail({
      ...this.state
    });

    // this.props.loginApiCall(
    //   this.oktaAuth,
    //   this.state.email,
    //   this.state.password
    // );
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <Paper elevation={4} className={classNames(classes.root)}>
        <Grid container>
          <Grid item xs={12}>
            <img
              alt={'transmute logo'}
              src={logo}
              className={classNames(classes.margin, classes.logo)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl
              className={classNames(classes.margin, classes.textField)}
            >
              <InputLabel htmlFor="adornment-email">Email</InputLabel>
              <Input
                className={classNames(classes.textInput)}
                id="email"
                type="email"
                value={this.state.email}
                onChange={this.handleChange('email')}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl
              className={classNames(classes.margin, classes.textField)}
            >
              <InputLabel htmlFor="adornment-password">Password</InputLabel>
              <Input
                className={classNames(classes.textInput)}
                id="password"
                type="password"
                value={this.state.password}
                onChange={this.handleChange('password')}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="raised"
              color="secondary"
              disabled={
                this.state.email.trim().length === 0 ||
                this.state.password.trim().length === 0
              }
              onClick={this.handleSubmit}
            >
              Register
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

const mapStateToProps = state => {
  return {
    // sessionToken: state.user.sessionToken,
    // error: state.user.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    registerWithActivationEmail: async credentials => {
      const { email, password } = credentials;

      console.log('dispatch redux action here...');
      let data = await actions.register({
        email,
        password
      });

      console.log('dispatch data...', data);
      // dispatch(loginApiCall(oktaAuth, email, password))
    }
    // loginApiCall: (oktaAuth, email, password) => dispatch(loginApiCall(oktaAuth, email, password))
  };
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Register)
);

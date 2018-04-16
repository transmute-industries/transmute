import React, { Component } from 'react';

import classNames from 'classnames';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';

import { connect } from 'react-redux';

import logo from '../../images/transmute.logo.png';

import * as actions from '../../store/user/actions';

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
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice@example.com'
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
    const { classes, user } = this.props;
    const registerForm = (
      <Grid container className={classNames(classes.root)}>
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
            <InputLabel htmlFor="adornment-firstName">First Name</InputLabel>
            <Input
              className={classNames(classes.textInput)}
              id="firstName"
              type="text"
              value={this.state.firstName}
              onChange={this.handleChange('firstName')}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl
            className={classNames(classes.margin, classes.textField)}
          >
            <InputLabel htmlFor="adornment-lastName">Last Name</InputLabel>
            <Input
              className={classNames(classes.textInput)}
              id="lastName"
              type="text"
              value={this.state.lastName}
              onChange={this.handleChange('lastName')}
            />
          </FormControl>
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
          <Button
            variant="raised"
            color="secondary"
            disabled={
              this.state.email.trim().length === 0 ||
              this.state.firstName.trim().length === 0 ||
              this.state.lastName.trim().length === 0
            }
            onClick={this.handleSubmit}
          >
            Register
          </Button>
        </Grid>
      </Grid>
    );

    const registrationSuccess = (
      <Grid container className={classNames(classes.root)}>
        <Grid item xs={12}>
          <h1>We have sent you an email!</h1>
          <h2>Follow the instructions to activate your account.</h2>
        </Grid>
      </Grid>
    );
    return !user.registration ? registerForm : registrationSuccess;
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    error: state.user.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    registerWithActivationEmail: async formData => {
      const { email, firstName, lastName } = formData;
      const action = await actions.register({
        email,
        firstName,
        lastName
      });
      // let action = {
      //   type: 'REGISTRATION_SUCCESS',
      //   payload: {
      //     id: '00ueq5di6qxVeztjg0h7',
      //     status: 'STAGED',
      //     created: '2018-04-15T19:17:59.000Z',
      //     activated: null,
      //     statusChanged: null,
      //     lastLogin: null,
      //     lastUpdated: '2018-04-15T19:17:59.000Z',
      //     passwordChanged: null,
      //     profile: {
      //       firstName: 'Alice',
      //       lastName: 'Smith',
      //       mobilePhone: null,
      //       secondEmail: null,
      //       login: 'alice@example.com',
      //       email: 'alice@example.com'
      //     },
      //     credentials: {
      //       provider: {
      //         type: 'OKTA',
      //         name: 'OKTA'
      //       }
      //     },
      //     _links: {
      //       activate: {
      //         href:
      //           'https://dev-665774.oktapreview.com/api/v1/users/00ueq5di6qxVeztjg0h7/lifecycle/activate',
      //         method: 'POST'
      //       },
      //       self: {
      //         href:
      //           'https://dev-665774.oktapreview.com/api/v1/users/00ueq5di6qxVeztjg0h7'
      //       }
      //     }
      //   }
      // };
      dispatch(action);
      // console.log(JSON.stringify(action, null, 2));
      // dispatch(loginApiCall(oktaAuth, email, password))
    }
  };
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Register)
);

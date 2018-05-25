import React from 'react';
import classNames from 'classnames';
import OktaAuth from '@okta/okta-auth-js';
import { withAuth } from '@okta/okta-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Grid from 'material-ui/Grid';

import { loginApiCall } from '../../../store/transmute/user/actions';

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

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      email: '',
      password: ''
    };
    this.oktaAuth = new OktaAuth({ url: props.baseUrl });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.loginApiCall(
      this.oktaAuth,
      this.state.email,
      this.state.password
    );
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    const { classes } = this.props;

    if (this.props.sessionToken) {
      this.props.auth.redirect({ sessionToken: this.props.sessionToken });
    }

    const errorMessage = this.props.error ? (
      <span className="error-message">{this.props.error}</span>
    ) : null;

    return (
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <FormControl
            className={classNames(classes.margin, classes.textField)}
          >
            <InputLabel htmlFor="adornment-password">Email</InputLabel>
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
            Login
          </Button>
        </Grid>
      </Grid>
    );
  }
}

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    sessionToken: state.user.sessionToken,
    error: state.user.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loginApiCall: (oktaAuth, email, password) =>
      dispatch(loginApiCall(oktaAuth, email, password))
  };
};

// We need an intermediary variable for handling the recursive nesting.
export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(withAuth(LoginForm))
);

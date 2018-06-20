import React, { Component } from 'react';

import classNames from 'classnames';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';

import { connect } from 'react-redux';

import logo from '../../../images/logo-icon-purple.svg';
import * as actions from '../../../store/transmute/user/actions';
import KeyUploadForm from '../../KeyUploadForm';

const styles = theme => ({
  root: {
    flexWrap: 'wrap',
    padding: '40px'
  },
  logo: {
    maxWidth: '225px',
    marginBottom: '40px'
  },
  text: {
    textAlign: 'center'
  }
});

class RegisterPage extends Component {

  render() {
    const { classes, user, registerWithActivationEmail } = this.props;
    const registerForm = (
      <Grid
        container
        spacing={16}
        justify='center'
        style={{ height: '100%' }}
      >
        <Grid container item xs={9} spacing={16} alignItems='center' justify='center' alignContent='center'>
          <Grid container item xs={9} alignItems='center' justify='center' alignContent='center'>
            <img
              alt={'transmute logo'}
              src={logo}
              className={classNames(classes.logo)}
            />
          </Grid>

          <KeyUploadForm
            onSubmit={registerWithActivationEmail}
            action={'Register'}
            user={user}
          />

          <Grid container item xs={9} alignItems='center' justify='center' alignContent='center'>
            <h4 className={classNames(classes.text)}>
              <a href="https://github.com/transmute-industries/transmute/wiki/Registration">
                Key Generation Instructions
              </a>{' '}
            </h4>
          </Grid>
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
      const action = await actions.register({
        primaryKey: formData.primary_key,
        recoveryKey: formData.recovery_key
      });
      dispatch(action);
    }
  };
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(RegisterPage)
);

import React, { Component } from 'react';

import classNames from 'classnames';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';

import { connect } from 'react-redux';

import logo from '../../../images/transmute.logo.png';

import * as actions from '../../../store/user/actions';
const openpgp = require('openpgp');

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
    minWidth: '400px'
  },
  textInput: {}
});

class Register extends Component {
  state = {
    error: null,
    edArmorPub: null,
    secArmorPub: null
  };

  handleSubmit = e => {
    e.preventDefault();

    this.props.registerWithActivationEmail({
      ...this.state
    });
  };

  handleKeyUpload = key => event => {
    const file = event.target.files[0];
    const filename = event.target.value.split(/(\\|\/)/g).pop();

    let reader = new window.FileReader();
    reader.onload = () => {
      const pub = openpgp.key.readArmored(
        reader.result
      ).keys[0];
      this.setState({
        [key]: pub.armor()
      });
    };
    reader.readAsText(file);
  };

  handleChange = key => async event => {
    this.setState({
      [key]: event.target.value
    });
  };

  render() {
    const { classes, user, edArmorPub, secArmorPub } = this.props;
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
            <input
              id="edKeyFile"
              type="file"
              onChange={this.handleKeyUpload('edArmorPub')}
              style={{
                width: 0,
                height: 0,
                opacity: 0,
                overflow: 'hidden',
                position: 'absolute',
                zIndex: 1,
              }}
            />
            <Button
              color="secondary"
              component="label"
              htmlFor="edKeyFile"
              // disabled={edArmorPub !== null}
            >
              Upload ED25519 Armored Public Key
            </Button>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl
            className={classNames(classes.margin, classes.textField)}
          >
            <input
              id="secKeyFile"
              type="file"
              onChange={this.handleKeyUpload('secArmorPub')}
              style={{
                width: 0,
                height: 0,
                opacity: 0,
                overflow: 'hidden',
                position: 'absolute',
                zIndex: 1,
              }}
            />
            <Button
              color="secondary"
              component="label"
              htmlFor="secKeyFile"
              // disabled={secArmorPub !== null}
            >
              Upload SECP256K1 Armored Public Key
            </Button>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="raised"
            color="secondary"
            disabled={
              this.state.edArmorPub == null ||
              this.state.secArmorPub == null
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
      const { edArmorPub, secArmorPub } = formData;
      const action = await actions.register({
        edArmorPub,
        secArmorPub
      });
      dispatch(action);
    }
  };
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Register)
);

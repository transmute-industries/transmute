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
    padding: '40px'
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  logo: {
    maxWidth: '300px'
  },
  margin: {
    margin: theme.spacing.unit
  },
  section: {
    padding: '0 40px'
  }
});

class RegisterPage extends Component {
  state = {
    error: null,
    ed25519: null,
    ed25519_filename: null,
    secp256k1: null,
    secp256k1_filename: null
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
    const key_filename = `${key}_filename`;

    let reader = new window.FileReader();
    reader.onload = () => {
      let pub;
      try {
        pub = openpgp.key.readArmored(reader.result).keys[0];

        if (pub.primaryKey.params[0].getName() !== key) {
          this.setState({
            error: `Uploaded key is ${pub.primaryKey.params[0].getName()}, please upload a ${key} key`
          });
        } else {
          this.setState({
            error: null,
            [key]: pub.armor(),
            [key_filename]: filename
          });
        }
      } catch (err) {
        this.setState({
          error: 'Uploaded file is not a key.'
        });
      }
    };
    reader.readAsText(file);
  };

  handleChange = key => async event => {
    this.setState({
      [key]: event.target.value
    });
  };

  render() {
    const { classes, user } = this.props;
    const {
      ed25519,
      ed25519_filename,
      secp256k1,
      secp256k1_filename,
      error
    } = this.state;
    const registerForm = (
      <Grid container className={classNames(classes.root)}>
        <Grid item xs={12} className={classNames(classes.logoContainer)}>
          <img
            alt={'transmute logo'}
            src={logo}
            className={classNames(classes.margin, classes.logo)}
          />
        </Grid>

        <Grid item xs={12} md={6} className={classNames(classes.section)}>
          <p>
            Please upload your ed25519 and secp256k1 keys. These keys need to
            have certified one another and must have the same email and name
            associated with each. If you are unfamiliar with generating and
            certifying keys,{' '}
            <a href="https://github.com/eolszewski/sec-ed-cert">
              this repository
            </a>{' '}
            can take care of that for you:
          </p>

          <h4>
            A registered account has a public profile, which contains the
            following fields: <br /> <br /> ID, EMAIL, FIRST_NAME, LAST_NAME,
            ED25519_PUB, SECP256K1_PUB.
          </h4>
        </Grid>

        <Grid item xs={12} md={6} className={classNames(classes.section)}>
          <p>
            The name is collected via email confirmation. The email is collected
            from the public keys.
          </p>
          <FormControl
            className={classNames(classes.margin, classes.textField)}
          >
            <input
              id="edKeyFile"
              type="file"
              onChange={this.handleKeyUpload('ed25519').bind(this)}
              style={{
                width: 0,
                height: 0,
                opacity: 0,
                overflow: 'hidden',
                position: 'absolute',
                zIndex: 1
              }}
            />
            <Button
              color="secondary"
              variant="raised"
              component="label"
              htmlFor="edKeyFile"
            >
              {ed25519 == null
                ? 'Upload ED25519 Armored Public Key'
                : ed25519_filename}
            </Button>
          </FormControl>
          <br />
          <FormControl
            className={classNames(classes.margin, classes.textField)}
          >
            <input
              id="secKeyFile"
              type="file"
              onChange={this.handleKeyUpload('secp256k1').bind(this)}
              style={{
                width: 0,
                height: 0,
                opacity: 0,
                overflow: 'hidden',
                position: 'absolute',
                zIndex: 1
              }}
            />
            <Button
              color="secondary"
              variant="raised"
              component="label"
              htmlFor="secKeyFile"
            >
              {secp256k1 == null
                ? 'Upload SECP256K1 Armored Public Key'
                : secp256k1_filename}
            </Button>
          </FormControl>
          <br />
          <FormControl
            className={classNames(classes.margin, classes.textField)}
          >
            <Button
              variant="raised"
              color="secondary"
              disabled={
                this.state.ed25519 == null || this.state.secp256k1 == null
              }
              onClick={this.handleSubmit}
            >
              Register
            </Button>
          </FormControl>
        </Grid>

        {error !== null && (
          <Grid item xs={12}>
            <p>{error}</p>
          </Grid>
        )}

        {user.error !== null && (
          <Grid item xs={12}>
            {user.error.error !== null && <p>{user.error.error}</p>}
            {user.error.message !== null && <p>{user.error.message}</p>}
          </Grid>
        )}
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
      const { ed25519, secp256k1 } = formData;
      const action = await actions.register({
        ed25519,
        secp256k1
      });
      dispatch(action);
    }
  };
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(RegisterPage)
);

import React, { Component } from 'react';
import LoginForm from './LoginForm';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import { withAuth } from '@okta/okta-react';
import logo from '../../../images/transmute.logo.png';
import OktaAuthButton from '../OktaAuthButton';

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

class LoginPage extends Component {
  render() {
    const { classes } = this.props;
    console.log(this.props);
    return (
      <Grid container className={classNames(classes.root)}>
        <Grid item xs={12}>
          <img
            alt={'transmute logo'}
            src={logo}
            className={classNames(classes.margin, classes.logo)}
          />
        </Grid>
        <Grid item xs={12}>
          <LoginForm baseUrl={this.props.baseUrl} />
          {/* <OktaAuthButton /> */}
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(withAuth(LoginPage));

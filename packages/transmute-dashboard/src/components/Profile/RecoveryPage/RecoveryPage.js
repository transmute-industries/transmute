import React, { Component } from 'react';

import classNames from 'classnames';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import { withAuth } from '@okta/okta-react';

import { connect } from 'react-redux';

import logo from '../../../images/logo-icon-purple.svg';
import * as actions from '../../../store/transmute/user/actions';
import KeyUploadForm from '../../KeyUploadForm';
import { history } from '../../../store';

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

class RecoveryPage extends Component {

  handleSubmit = (formData) => {
    this.props.recoverWithPublicKeys(this.props.auth, formData);
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.user.recovery) {
      history.push('/profile');
    }
  }

  render() {
    const { classes, user } = this.props;

    return (
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
            onSubmit={this.handleSubmit}
            action={'Upload Recovery Keys'}
            user={user}
          />

          <Grid container item xs={9} alignItems='center' justify='center' alignContent='center'>
            <h4 className={classNames(classes.text)}>
              <a href="https://github.com/transmute-industries/transmute/wiki/Recovery">
                Key Generation Instructions
              </a>{' '}
            </h4>
          </Grid>
        </Grid>
      </Grid>
    );
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
    recoverWithPublicKeys: async (auth, formData) => {
      const action = await actions.recover(auth, {
        primaryKey: formData.primary_key,
        recoveryKey: formData.recovery_key
      });
      dispatch(action);
    }
  };
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(
    withAuth(RecoveryPage)
  )
);

import React, { Component } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import AppBar from '../AppBar';

import { withAuth } from '@okta/okta-react';

import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import theme from '../../theme';

import { history } from '../../store';

const styles = {
  card: {
    maxWidth: 500
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  media: {
    height: 200
  }
};

class Home extends Component {
  render() {
    const { classes } = this.props;
    return (
      <AppBar>
        <Typography gutterBottom variant="headline" component="h1">
          The Transmute Dashboard is for testing the integration of the
          Transmute Framework and the Transmute Platform.
        </Typography>

        <Typography gutterBottom component="p">
          It is currently pre-release, alpha level software and subject to
          change or deletion.
        </Typography>

        <br />
        <div>
          <a
            href="https://app.termly.io/document/privacy-policy/303f0500-cbf0-4dd4-a864-31c548aa635f"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy
          </a>{' '}
          |{' '}
          <a
            href="https://app.termly.io/document/terms-of-use-for-website/8db62488-1d0c-448f-aea3-c54695d79615"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms
          </a>
        </div>

        <br />
        <Card className={classes.card}>
          <CardContent>
            <Typography gutterBottom variant="headline" component="h2">
              E-Signer Demo
            </Typography>
            <Typography component="p">
              In this demo, we'll be creating and signing documents with
              Ethereum and IPFS.
              <br />
              <br />
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              variant={'raised'}
              color="primary"
              onClick={() => {
                history.push('/demo');
              }}
            >
              View E-Signer Demo
            </Button>
          </CardActions>
        </Card>
      </AppBar>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    go: somePath => dispatch(push(somePath))
    // setWeb3Account: async web3Account => {
    //   dispatch(actionsCreators.setWeb3Account(web3Account));
    // }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(withAuth(Home))
);

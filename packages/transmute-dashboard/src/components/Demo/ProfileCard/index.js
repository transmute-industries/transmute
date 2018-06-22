import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Card, { CardActions, CardContent } from 'material-ui/Card';

const styles = theme => ({
  image: {
    width: '100%'
  },
  root: theme.mixins.gutters({
    paddingRight: 8,
    paddingLeft: 8,
    paddingTop: 20
  })
});

class ProfileCard extends React.Component {

  handleSignatureUpload = event => {
    this.props.onSignatureUpload(event);
  };

  render() {
    const { classes, signature } = this.props;
    return (
      <Card>
        <CardContent className={classes.root}>
          {signature !== null ? (
            <div>
              <p>My Signature</p>
              <img
                src={
                  'https://ipfs.infura.io/api/v0/cat?arg=' +
                  this.props.signature
                }
                alt="My Signature"
                className={classes.image}
              />
            </div>
          ) : (
            <p>No signatures found for your account, please upload one.</p>
          )}
        </CardContent>
        <CardActions>
          <input
            id="signatureFile"
            type="file"
            onChange={this.handleSignatureUpload}
            style={{
              width: 0,
              height: 0,
              opacity: 0,
              overflow: 'hidden',
              position: 'absolute',
              zIndex: 1
            }}
          />
          <br />
          <Button
            component="label"
            htmlFor="signatureFile"
            color="secondary"
            disabled={signature !== null}
          >
            Upload New Signature
          </Button>
        </CardActions>
      </Card>
    );
  }
}

ProfileCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProfileCard);

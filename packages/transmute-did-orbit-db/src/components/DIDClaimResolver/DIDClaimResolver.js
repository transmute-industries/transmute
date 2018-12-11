import React, { Component } from "react";

import Button from "@material-ui/core/Button";

import TextField from "@material-ui/core/TextField";

import { withStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";

import exampleDIDClaim from "../../data/did_claim.json";
const fullPlaceholder = `/orbitdb/QmQ8ZK.../did:openpgp:fingerprint:21b5ef5af6...`;

const styles = theme => ({
  container: {
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "100%"
  },
  paper: {
    padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary
  }
});

class DIDClaimResolver extends Component {
  state = {
    contentID: exampleDIDClaim.claimID
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  componentWillReceiveProps(nextProps){
    if (nextProps.contentID){
      this.setState({
        contentID: nextProps.contentID
      })
    }
   
  }

  render() {
    const { classes, resolve } = this.props;

    return (
      <div className={classes.container}>
        <Paper className={classes.paper}>
        <h3>DID Claim Resolver</h3>
        <TextField
          id="standard-with-placeholder"
          label="Signature ID"
          placeholder={fullPlaceholder}
          className={classes.textField}
          value={this.state.contentID}
          onChange={this.handleChange("contentID")}
          margin="normal"
        />
        {this.state.doc && <pre>{JSON.stringify(this.state.doc, null, 2)}</pre>}

        <Button
          variant="contained"
          color="primary"
          onClick={async () => {
            const doc = await resolve(this.state.contentID);
            this.setState({
              doc
            });
          }}
        >
          Resolve
        </Button>
        </Paper>
      
      </div>
    );
  }
}

export default withStyles(styles)(DIDClaimResolver);

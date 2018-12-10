import React, { Component } from "react";

import Button from "@material-ui/core/Button";

import TextField from "@material-ui/core/TextField";

import { withStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";

import exampleDIDClaim from "../../data/did_claim.json";
const fullPlaceholder = `/orbitdb/QmQ8ZK.../did:openpgp:fingerprint:21b5ef5af6...`;

const styles = theme => ({
  container: {
    width: "100%"
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

class DIDResolveAndSignClaim extends Component {
  state = {
    contentID: exampleDIDClaim.claimID,
    password: "yolo",
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.contentID) {
      this.setState({
        contentID: nextProps.contentID
      });
    }
  }

  render() {
    const { did, classes, resolve, isLinkedDataSignedByDocument, onClaimCreated, createOrbitDIDClaimFromWallet } = this.props;

    return (
      <div className={classes.container}>
        <TextField
          id="standard-with-placeholder"
          label="Claim ID"
          placeholder={fullPlaceholder}
          className={classes.textField}
          value={this.state.contentID}
          onChange={this.handleChange("contentID")}
          margin="normal"
        />
        <TextField
          id="standard-with-placeholder"
          label="Password"
          placeholder={fullPlaceholder}
          className={classes.textField}
          value={this.state.password}
          onChange={this.handleChange("password")}
          margin="normal"
        />
        {this.state.doc && <pre>{JSON.stringify(this.state.doc, null, 2)}</pre>}

        <Button
          variant="contained"
          color="primary"
          onClick={async () => {
            let result = await resolve(this.state.contentID);

            if (
              isLinkedDataSignedByDocument({
                signedLinkedData: result.claim,
                didDocument: did.did_document
              })
            ) {
              console.log("signed already");
            } else {

              const firstKID = did.did_document.publicKey[0].id.split(
                "#kid="
              )[1];

              result = await createOrbitDIDClaimFromWallet({
                did: did.did_document.id,
                kid: firstKID,
                claim: result.claim,
                wallet: did.wallet,
                password: this.state.password
              });
              onClaimCreated(result)
              result = await resolve(result.claimID);
            }

            this.setState({
              doc: result
            });
          }}
        >
          Resolve
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(DIDResolveAndSignClaim);

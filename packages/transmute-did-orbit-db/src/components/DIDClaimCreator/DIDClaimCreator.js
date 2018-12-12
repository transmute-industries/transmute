import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

// eslint-disable-next-line
import brace from "brace";
import AceEditor from "react-ace";

import "brace/mode/json";
import "brace/theme/github";
const stringify = require('json-stringify-deterministic');

const styles = theme => ({
  container: {
    width: "100%"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "100%"
  }
});

class DIDClaimCreator extends Component {
  state = {
    password: "yolo",
    claimText: stringify(
      {
        hello: "world"
      },
      null,
      2
    )
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  componentWillMount() {
    this.setState({
      claimText: stringify(
        {
          subject: this.props.did.did_document.id,
          claims: {
            isTruckDriver: true,
            isInvestor: true,
            isDoctor: false
          }
        },
        null,
        2
      )
    });
  }

  render() {
    const {
      did,
      createOrbitDIDClaimFromWallet,
      onClaimCreated,
      classes
    } = this.props;

    return (
      <div className={classes.container}>
        <Grid container spacing={24}>
          <Grid item xs={12} md={12}>
            <AceEditor
              mode="json"
              theme="github"
              style={{
                width: "100%"
              }}
              onChange={value => {
                this.setState({
                  claimText: value
                });
              }}
              value={this.state.claimText}
              name="UNIQUE_ID_OF_DIV"
              editorProps={{ $blockScrolling: true }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              id="did-wallet-password-field"
              label="Password"
              placeholder={"yolo"}
              className={classes.textField}
              value={this.state.password}
              onChange={this.handleChange("password")}
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              style={{
                float: "right"
              }}
              onClick={async () => {
            
                const firstKID = did.did_document.publicKey[0].id.split(
                  "#kid="
                )[1];

                const claimData = await createOrbitDIDClaimFromWallet({
                  did: did.did_document.id,
                  kid: firstKID,
                  claim: JSON.parse(this.state.claimText),
                  wallet: did.wallet,
                  password: this.state.password
                });
                onClaimCreated(claimData)
              }}
            >
              Create DID Claim
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(DIDClaimCreator);

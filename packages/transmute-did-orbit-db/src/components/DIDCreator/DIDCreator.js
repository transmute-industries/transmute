import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

import {
  createOrbitDIDWallet,
  createOrbitDIDFromWallet
} from "../../utils/orbitHelpers";

const styles = theme => ({
  container: {
    // margin: "16px",
    // display: "flex",
    // flexWrap: "wrap"
  }
});

class DIDCreator extends Component {
  state = {
    password: "yolo"
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    const { onDIDCreated, classes } = this.props;

    return (
      <div className={classes.container}>
        <h3>Create DID</h3>
        <Grid container spacing={24}>
          <Grid item xs={12} md={6}>
            <TextField
              id="did-wallet-password-field"
              label="Password"
              placeholder={"yolo"}
              className={classes.textField}
              value={this.state.password}
              onChange={this.handleChange("password")}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={async () => {
                const w = await createOrbitDIDWallet(this.state.password);
                const data = await createOrbitDIDFromWallet(
                  w,
                  this.state.password
                );
                onDIDCreated({
                  wallet_json: data.wallet.data,
                  wallet_password: data.password,
                  did_document: data.did_document
                });
              }}
            >
              Create DID
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(DIDCreator);

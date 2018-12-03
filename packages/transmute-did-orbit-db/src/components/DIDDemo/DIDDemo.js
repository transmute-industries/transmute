import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import DIDCreator from "../DIDCreator";
import DIDClaimCreator from "../DIDClaimCreator";
import DIDView from "../DIDView";
import DIDSelector from "../DIDSelector";
import DIDResolver from "../DIDResolver";

import DIDClaimsVerifier from "../DIDClaimsVerifier";

import {
  createOrbitDIDFromWallet,
  TransmuteDIDWallet,
  orbitDIDResolver,
  createOrbitDIDClaimFromWallet
} from "../../utils/orbitHelpers";

const styles = theme => ({
  container: {
    flexGrow: 1,
    margin: "16px"
  },
  paper: {
    padding: theme.spacing.unit * 2,
    // textAlign: "center",
    color: theme.palette.text.secondary
  }
});

class DIDDemo extends Component {
  state = {
    dids: [],
    claimDatas: []
  };

  async componentWillMount() {
    let maybeCurrentDID = localStorage.getItem("current_did");
    if (maybeCurrentDID) {
      const { wallet_json, wallet_password } = JSON.parse(maybeCurrentDID);
      const wallet = new TransmuteDIDWallet(wallet_json);
      const did = await createOrbitDIDFromWallet(wallet, wallet_password);
      this.setState({
        current_did: did,
        dids: [did]
      });
    }

    let maybeClaimDatas = localStorage.getItem("claimDatas");
    if (maybeClaimDatas) {
      this.setState({
        claimDatas: [JSON.parse(maybeClaimDatas)]
      });
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  onDIDCreated = did => {
    localStorage.setItem(
      "current_did",
      JSON.stringify({
        wallet_json: did.wallet.data,
        wallet_password: did.password,
        did_document: did.did_document
      })
    );

    this.setState({
      dids: [...this.state.dids, did],
      current_did: did
    });
  };

  onDIDSelected = did => {
    this.setState({
      current_did: did
    });
  };

  onClaimCreated = claimDatas => {
    // console.log(claimDatas);

    localStorage.setItem("claimDatas", JSON.stringify(claimDatas));

    this.setState({
      claimDatas: [...this.state.claimDatas, claimDatas],
      current_claim: claimDatas
    });
  };

  render() {
    const { classes } = this.props;

    let current_did;
    if (this.state.current_did && this.state.current_did.did_document){
      current_did = this.state.current_did.did_document.id;
    }

    return (
      <div className={classes.container}>
        <Grid container spacing={24}>
          {this.state.dids[0] && (
            <Grid item xs={12} md={12}>
              <Paper className={classes.paper}>
                <DIDView did={this.state.current_did} />

                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>
                      Create Claim
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <DIDClaimCreator
                      style={{ width: "100%" }}
                      did={this.state.current_did}
                      createOrbitDIDClaimFromWallet={
                        createOrbitDIDClaimFromWallet
                      }
                      onClaimCreated={this.onClaimCreated}
                    />
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </Paper>
            </Grid>
          )}
          <Grid item xs={6} md={6}>
            <Paper className={classes.paper}>
              <DIDCreator onDIDCreated={this.onDIDCreated} />
            </Paper>
          </Grid>
          <Grid item xs={6} md={6}>
            <Paper className={classes.paper}>
              <h3>Impersonate</h3>
              <DIDSelector
                current_did={this.state.current_did}
                dids={this.state.dids}
                onSelected={this.onDIDSelected}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={12}>
            <DIDResolver resolve={orbitDIDResolver} did={current_did}/>
          </Grid>

          <Grid item xs={12} md={12}>
            <Paper className={classes.paper}>
              <DIDClaimsVerifier
                resolve={orbitDIDResolver}
                claimDatas={this.state.claimDatas}
              />
            </Paper>
          </Grid>

          {/* <Grid item xs={12}>
            <Paper className={classes.paper}>
              <h3>Debug</h3>
              <pre>{JSON.stringify(this.state, null, 2)}</pre>
            </Paper>
          </Grid> */}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(DIDDemo);

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
import DIDClaimResolver from "../DIDClaimResolver";

import DIDClaimsVerifier from "../DIDClaimsVerifier";
import DIDRevocationsList from "../DIDRevocationsList";

import {
  createOrbitDIDFromWallet,
  TransmuteDIDWallet,
  orbitDIDResolver,
  orbitDIDClaimResolver,
  createOrbitDIDClaimFromWallet,
  revokeKIDWithOrbitDB
} from "../../utils/orbitHelpers";

const styles = theme => ({
  container: {
    flexGrow: 1,
    margin: "16px"
  },
  paper: {
    padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary
  }
});

class DIDDemo extends Component {
  state = {
    dids: [],
    claimDatas: []
  };

  async componentWillMount() {
    let maybeCurrentDIDs = localStorage.getItem("current_dids");
    if (maybeCurrentDIDs) {
      const dids = JSON.parse(maybeCurrentDIDs);
      const wallet = new TransmuteDIDWallet(dids[0].wallet_json);
      const did = await createOrbitDIDFromWallet(
        wallet,
        dids[0].wallet_password
      );
      this.setState({
        current_did: did,
        dids: dids
      });
    }

    let maybeClaimDatas = localStorage.getItem("claimDatas");
    if (maybeClaimDatas) {
      this.setState({
        claimDatas: JSON.parse(maybeClaimDatas)
      });
    }
  }

  onDIDCreated = did => {
    localStorage.setItem(
      "current_dids",
      JSON.stringify([...this.state.dids, did])
    );
    this.setState({
      dids: [...this.state.dids, did],
      current_did: did
    });
  };

  onDIDSelected = async did => {
    const wallet = new TransmuteDIDWallet(did.wallet_json);
    did = await createOrbitDIDFromWallet(wallet, did.wallet_password);
    this.setState({
      current_did: did
    });
  };

  onClaimCreated = claimDatas => {
    const allClaimData = [...this.state.claimDatas, claimDatas];
    localStorage.setItem("claimDatas", JSON.stringify(allClaimData));
    this.setState({
      claimDatas: allClaimData,
      current_claim: claimDatas
    });
  };

  render() {
    const { classes } = this.props;
    let current_did, current_claim;
    if (this.state.current_did && this.state.current_did.did_document) {
      current_did = this.state.current_did.did_document.id;
    }

    if (this.state.claimDatas.length) {
      current_claim = this.state.claimDatas[0].claimID;
    }

    return (
      <div className={classes.container}>
        <Grid container spacing={24}>
          <Grid item xs={3} md={3}>
            <Paper className={classes.paper}>
              <DIDCreator onDIDCreated={this.onDIDCreated} />
            </Paper>
          </Grid>
          <Grid item xs={9} md={9}>
            <Paper className={classes.paper}>
              <h3>Impersonate DID</h3>
              <DIDSelector
                current_did={this.state.current_did}
                dids={this.state.dids}
                onSelected={this.onDIDSelected}
              />
            </Paper>
          </Grid>

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

                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>
                      Revocations
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <DIDRevocationsList
                      did={this.state.current_did}
                      revokeKIDWithOrbitDB={revokeKIDWithOrbitDB}
                    />
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </Paper>
            </Grid>
          )}

          <Grid item xs={12} md={12}>
            <DIDResolver resolve={orbitDIDResolver} did={current_did} />
          </Grid>

          <Grid item xs={12} md={12}>
            <DIDClaimResolver
              resolve={orbitDIDClaimResolver}
              signatureID={current_claim}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <Paper className={classes.paper}>
              <DIDClaimsVerifier
                resolve={orbitDIDClaimResolver}
                claimDatas={this.state.claimDatas}
              />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(DIDDemo);

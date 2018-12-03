import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Snackbar from "@material-ui/core/Snackbar";

import { verifyDIDSignature } from "../../utils/orbitHelpers";

const styles = theme => ({
  container: {
    // margin: "16px",
    // display: "flex",
    // flexWrap: "wrap"
  }
});

class DIDClaimsVerifier extends Component {

  state ={
    open: false,
    message: ''
  }
  render() {
    const { claimDatas, resolve, classes } = this.props;

    return (
      <div className={classes.container}>
        <h3>Verify Claims</h3>

        {claimDatas.map(data => {
          return (
            <ExpansionPanel key={data.signatureID}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>
                  {data.signatureID}
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container spacing={24}>
                  <Grid item xs={12} md={6}>
                    <pre>{JSON.stringify(data.resolvedClaim, null, 2)}</pre>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={async () => {
                        const { object, signature, meta } = data.resolvedClaim;
                        const doc = await resolve(meta.kid.split("#kid=")[0]);

                        const isValid = await verifyDIDSignature(
                          object,
                          signature,
                          meta,
                          doc
                        );

                        this.setState({
                          open: true,
                          message: `signature is ${
                            isValid ? "valid" : "not valid"
                          }`
                        });

                        setTimeout(() => {
                          this.setState({
                            open: false
                          });
                        }, 3 * 1000);
                      }}
                    >
                      Verify
                    </Button>
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          );
        })}

        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={this.state.open}
          onClose={this.handleClose}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">{this.state.message}</span>}
        />
      </div>
    );
  }
}

export default withStyles(styles)(DIDClaimsVerifier);

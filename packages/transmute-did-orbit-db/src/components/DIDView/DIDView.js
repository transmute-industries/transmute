import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import Snackbar from "@material-ui/core/Snackbar";

import QRCode from "qrcode.react";

import { CopyToClipboard } from "react-copy-to-clipboard";

import DIDDocumentWithRevocations from "../DIDDocumentWithRevocations";

const styles = theme => ({
  container: {
    // margin: "16px",
    // display: "flex",
    // flexWrap: "wrap"
    textAlign: "left"
  },
  heading: {
    // fontSize: theme.typography.pxToRem(15),
    // fontWeight: theme.typography.fontWeightRegular
  }
});

class DIDView extends Component {
  state = {
    copied: false
  };

  render() {
    const { did, classes } = this.props;

    return (
      <div className={classes.container}>
        <h3>Current DID</h3>
        <ExpansionPanel
          key={did.did_document.id}
          style={{ backgroundColor: "#d1c4e9" }}
        >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>
              {did.did_document.id}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container spacing={24}>
              <Grid item xs={12} md={2}>
                <CopyToClipboard
                  style={{
                    cursor: "pointer"
                  }}
                  text={did.did_document.id}
                  onCopy={() => {
                    this.setState({ copied: true, open: true });
                    setTimeout(() => {
                      this.setState({ open: false });
                    }, 1 * 1000);
                  }}
                >
                  <QRCode value={did.did_document.id} />
                </CopyToClipboard>
              </Grid>
              <Grid item xs={12} md={10}>
                <pre>{JSON.stringify(did.did_document, null, 2)}</pre>
              </Grid>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={this.state.open}
          onClose={this.handleClose}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">Copied to Clipboard</span>}
        />
      </div>
    );
  }
}

export default withStyles(styles)(DIDView);

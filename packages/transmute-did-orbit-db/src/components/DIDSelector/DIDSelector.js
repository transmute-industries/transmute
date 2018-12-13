import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import stringify from 'json-stringify-deterministic';

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

class DIDSelector extends Component {
  state = {};

  render() {
    const { dids, onSelected, current_did, classes } = this.props;

    return (
      <div className={classes.container}>
        {dids && dids.map(did => {
          return (
            <ExpansionPanel
              key={did.did_document.id}
              style={{
                backgroundColor:
                  current_did && current_did.did_document && 
                  did.did_document.id === current_did.did_document.id
                    ? "#d1c4e9"
                    : ""
              }}
            >
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>
                  {did.did_document.id}
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container spacing={24}>
                  <Grid item xs={12} md={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        onSelected(did);
                      }}
                    >
                      Impersonate
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <pre>{stringify(did.did_document, null, 2)}</pre>
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          );
        })}
      </div>
    );
  }
}

export default withStyles(styles)(DIDSelector);

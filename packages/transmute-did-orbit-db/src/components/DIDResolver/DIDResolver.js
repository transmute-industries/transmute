import React, { Component } from "react";

import Button from "@material-ui/core/Button";

import TextField from "@material-ui/core/TextField";

import { withStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";

import didDocumentExample from "../../data/did_document.json";
const fullPlaceholder = `/orbitdb/QmQ8ZK.../did:openpgp:fingerprint:21b5ef5af6...`;

const styles = theme => ({
  container: {
    // display: "flex",
    // flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "100%"
  },
  paper: {
    padding: theme.spacing.unit * 2,
    // textAlign: "center",
    color: theme.palette.text.secondary
  }
});

class DIDResolver extends Component {
  state = {
    did: didDocumentExample.id
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.did) {
      this.setState({
        did: nextProps.did
      });
    }
  }

  render() {
    const { classes, resolve } = this.props;

    return (
      <div className={classes.container}>
        <Paper className={classes.paper}>
          <h3>DID Resolver</h3>
          <TextField
            id="standard-with-placeholder"
            label="DID"
            placeholder={fullPlaceholder}
            className={classes.textField}
            value={this.state.did}
            onChange={this.handleChange("did")}
            margin="normal"
          />
          {this.state.doc && (
            <pre>{JSON.stringify(this.state.doc, null, 2)}</pre>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              const doc = await resolve(this.state.did);
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

export default withStyles(styles)(DIDResolver);

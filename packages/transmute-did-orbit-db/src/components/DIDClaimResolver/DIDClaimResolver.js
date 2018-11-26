import React, { Component } from "react";

import Button from "@material-ui/core/Button";

import TextField from "@material-ui/core/TextField";

import { withStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

import exampleClaim from "../../data/did_claim.json";

const {
  createOrbitClaimResolver,
  verifyDIDSignature,
  SignatureStore,
  TransmuteAdapterOrbitDB
} = require("../../utils/orbitHelpers");

const fullPlaceholder = `/orbitdb/QmQ8ZK.../did:openpgp:fingerprint:21b5ef5af6...`;

const styles = theme => ({
  container: {
    margin: "16px",
    display: "flex",
    flexWrap: "wrap"
  },
  card: {
    maxWidth: "auto",
    textAlign: "left"
  },
  media: {
    // ⚠️ object-fit is not supported by IE 11.
    objectFit: "cover"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "100%"
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  }
});

class DIDClaimResolver extends Component {
  state = {
    ...exampleClaim
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    const { classes, orbitdb } = this.props;
    const resolver = createOrbitClaimResolver(
      orbitdb,
      TransmuteAdapterOrbitDB,
      SignatureStore,
      verifyDIDSignature
    );
    return (
      <div className={classes.container}>
        <Card className={classes.card}>
          <CardActionArea>
            <CardMedia
              component="img"
              alt="Decentralized Identifier Claims"
              className={classes.media}
              height="140"
              image="https://source.unsplash.com/category/nature/1280x1024"
              title="Decentralized Identifier Claims"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Decentralized Identifier Claims
              </Typography>
              <Typography component="p">
                Decentralized Identifiers (DIDs) are a new type of identifier
                for verifiable, "self-sovereign" digital identity. DIDs are
                fully under the control of the DID subject, independent from any
                centralized registry, identity provider, or certificate
                authority.
              </Typography>

              <TextField
                id="standard-with-placeholder"
                label="DID"
                placeholder={fullPlaceholder}
                className={classes.textField}
                value={this.state.did}
                onChange={this.handleChange("did")}
                margin="normal"
              />

              <TextField
                id="standard-with-placeholder"
                label="signatureID"
                className={classes.textField}
                value={this.state.signatureID}
                onChange={this.handleChange("signatureID")}
                margin="normal"
              />

              {this.state.doc && (
                <pre>{JSON.stringify(this.state.doc, null, 2)}</pre>
              )}
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button
              size="small"
              color="primary"
              href="https://www.w3.org/TR/verifiable-claims-data-model/"
            >
              Learn More
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={async () => {
                const doc = await resolver.resolve(
                  this.state.did,
                  this.state.signatureID
                );
                this.setState({
                  doc
                });
              }}
            >
              Resolve
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(DIDClaimResolver);

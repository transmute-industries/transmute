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
  createOrbitDIDRevocationChecker,
  verifyDIDSignature
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

class DIDRevocationChecker extends Component {
  state = {
    did:
      "did:orbitdb.transmute.openpgp:QmULyfPwJKz236u3JwraC5QxbpcW8ChACLDUugS2erjvdK.2236202fdd594220f4108841df05215123cb4ca8"
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    const { classes, orbitdb } = this.props;
    const resolver = createOrbitDIDRevocationChecker(
      orbitdb,
      verifyDIDSignature
    );
    return (
      <div className={classes.container}>
        <Card className={classes.card}>
          <CardActionArea>
            <CardMedia
              component="img"
              alt="DID Revocation Checker"
              className={classes.media}
              height="140"
              image="https://source.unsplash.com/category/nature/1280x1024"
              title="DID Revocation Checker"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                DID Revocation Checker
              </Typography>
              <Typography component="p">REvocations are speciall...</Typography>

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
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button
              size="small"
              color="primary"
              href="https://w3c-ccg.github.io/did-spec/#key-revocation-and-recovery"
            >
              Learn More
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={async () => {
                const doc = await resolver.resolve(this.state.did);
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

export default withStyles(styles)(DIDRevocationChecker);

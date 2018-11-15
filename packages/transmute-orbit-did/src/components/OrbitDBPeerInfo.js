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


const didPlaceholder =
  "did:openpgp:fingerprint:21b5ef5af61ce78cce35f9c0101f800c3448abae";
const peerId = "/orbitdb/QmQ8ZKRR4n8sA4PTMv7vX48rYwKjHWidd5fzn66kxHiCgZ";
const didExample = `${peerId}/${didPlaceholder}`;

const styles = theme => ({
  container: {
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

class OrbitDBPeerInfo extends Component {
  state = {
    address: didExample,
    data: []
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  async componentWillMount() {
    this.setState({
      peerInfo: await this.props.ipfs.id()
    });
  }
  render() {
    const { classes, orbitdb } = this.props;
    return (
      <div className="OrbitDBPeerInfo">
        <Card className={classes.card}>
          <CardActionArea>
            <CardMedia
              component="img"
              alt="Decentralized Identifier Resolver"
              className={classes.media}
              height="140"
              image="https://source.unsplash.com/category/nature/1280x1024"
              title="Decentralized Identifier Resolver"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Orbit DB
              </Typography>
              <Typography component="p">
                OrbitDB is a serverless, distributed, peer-to-peer database.
                OrbitDB uses IPFS as its data storage and IPFS Pubsub to
                automatically sync databases with peers. It's an eventually
                consistent database that uses CRDTs for conflict-free database
                merges making OrbitDB an excellent choice for decentralized apps
                (dApps), blockchain applications and offline-first web
                applications.
              </Typography>

              <pre>{JSON.stringify(this.state.peerInfo, null, 2)}</pre>

              <TextField
                id="standard-with-placeholder"
                label="Database"
                placeholder={
                  "/orbitdb/QmfY3udPcWUD5NREjrUV351Cia7q4DXNcfyRLJzUPL3wPD/hello"
                }
                className={classes.textField}
                value={this.state.address}
                onChange={this.handleChange("address")}
                margin="normal"
              />

              <pre>{JSON.stringify(this.state.data, null, 2)}</pre>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button
              size="small"
              color="primary"
              href="https://github.com/orbitdb/orbit-db"
            >
              Learn More
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={async () => {
                // console.log("resolve me", this.state.did);
                const db = await orbitdb.open(this.state.address);
                await db.load();
                const data =  await db.get(didPlaceholder);
                this.setState({
                  data
                });
              }}
            >
              Open Database
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(OrbitDBPeerInfo);

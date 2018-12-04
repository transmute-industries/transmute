import React, { Component } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import MoodGoodIcon from "@material-ui/icons/Mood";
import MoodBadIcon from "@material-ui/icons/MoodBad";
import DeleteIcon from "@material-ui/icons/Delete";
import InfoIcon from "@material-ui/icons/Info";
import Snackbar from "@material-ui/core/Snackbar";

import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  container: {
    textAlign: "left"
  },
  heading: {}
});

class DIDDocumentWithRevocations extends Component {
  state = {
    open: false,
    message: ""
  };
  render() {
    const { doc, classes } = this.props;

    return (
      <div className={classes.container}>
        <List dense={true}>
          {doc.publicKey.map(key => {
            const revocation = key.revocation !== undefined;
            const kid = key.id.split("#kid=")[1];
            return (
              <ListItem key={key.id}>
                <ListItemAvatar>
                  <Avatar
                    style={{
                      backgroundColor: revocation ? "red" : "green"
                    }}
                  >
                    {revocation ? <MoodBadIcon /> : <MoodGoodIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={kid}
                  secondary={revocation ? key.revocation.id : key.type}
                />
                <ListItemSecondaryAction>
                  {revocation ? (
                    <IconButton
                      aria-label="Revocation Info"
                      onClick={() => {
                        this.setState({
                          open: true,
                          message: `Revocation ${key.revocation.hash}`
                        });
                        setTimeout(() => {
                          this.setState({
                            open: false
                          });
                        }, 3 * 1000);
                      }}
                    >
                      <InfoIcon />
                    </IconButton>
                  ) : (
                    <IconButton
                      aria-label="Delete"
                      onClick={async () => {
                        console.log("data", key);

                        const data = await this.props.revokeKIDWithOrbitDB({
                          kid,
                          revocations: key.revocations,
                          wallet: this.props.wallet
                        });
                        console.log("data", data);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>

        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={this.state.open}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">{this.state.message}</span>}
        />
      </div>
    );
  }
}

export default withStyles(styles)(DIDDocumentWithRevocations);

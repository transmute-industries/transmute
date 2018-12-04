import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";

import { orbitDIDRevocationsResolver } from "../../utils/orbitHelpers";

import DIDDocumentWithRevocations from "../DIDDocumentWithRevocations";

const styles = theme => ({
  container: {
    // margin: "16px",
    // display: "flex",
    // flexWrap: "wrap"
  }
});

class DIDRevocationsList extends Component {
  state = {
    did: null,
    doc: null
  };

  async componentWillReceiveProps(nextProps) {
    if (this.state.did !== nextProps.did.did_document.id) {
      const { doc } = await orbitDIDRevocationsResolver(
        nextProps.did.did_document.id
      );

      this.setState({
        did: nextProps.did.did_document.id,
        doc
      });
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        {/* {this.state.revokedPublicKeys && this.state.revokedPublicKeys.map(key => (
          <pre key={key.id}>{JSON.stringify(key, null, 2)}</pre>
        ))} */}
        {this.state.doc && <DIDDocumentWithRevocations doc={this.state.doc} revokeKIDWithOrbitDB={this.props.revokeKIDWithOrbitDB} wallet={this.props.did.wallet}/>}
      </div>
    );
  }
}

export default withStyles(styles)(DIDRevocationsList);

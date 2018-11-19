import React, { Component } from "react";
import GitHubForkRibbon from "react-github-fork-ribbon";

import DIDResolver from "./components/DIDResolver";
import ClaimResolver from "./components/ClaimResolver";

const { getOrbitDBFromKeypair, ipfsOptions } = require("./orbitHelpers");

class App extends Component {
  state = {
    ready: false,
    address: ""
  };
  async componentWillMount() {
    const keypair = {
      publicKey:
        "044ae395f44339e7838c406e127791c149dada742fd9674e64125fb07b15bda5e1dcbd8ff4042af018404da79f22a3895fae7aaf528e3c445e193324a026afe670",
      privateKey:
        "a6574e23c60bbf9e55fa2f6eef9ee1c3f91652d0ab7421dad3899f496108e86f"
    };
    this.setState({
      orbitdb: await getOrbitDBFromKeypair(ipfsOptions, keypair)
    });
  }
  render() {
    const { orbitdb } = this.state;
    return (
      <div className="App">
        <GitHubForkRibbon
          href="//github.com/OR13/create-react-app-orbit-db"
          target="_blank"
          position="right"
        >
          Fork me on GitHub
        </GitHubForkRibbon>
        {orbitdb && (
          <div>
            {" "}
            {/* <OrbitDBPeerInfo ipfs={ipfs} orbitdb={orbitdb} /> */}
            <DIDResolver orbitdb={orbitdb} />
            <ClaimResolver orbitdb={orbitdb} />
          </div>
        )}
      </div>
    );
  }
}

export default App;

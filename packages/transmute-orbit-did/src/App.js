import React, { Component } from "react";
import GitHubForkRibbon from "react-github-fork-ribbon";

import "./App.css";

// import OrbitDBPeerInfo from "./components/OrbitDBPeerInfo";
import DIDResolver from "./components/DIDResolver";

const OrbitDB = require("orbit-db");

// eslint-disable-next-line
const ipfs = new window.Ipfs({
  repo: "/orbitdb/examples/browser/new/ipfs/0.27.3",
  start: true,
  EXPERIMENTAL: {
    pubsub: true
  },
  config: {
    Addresses: {
      Swarm: [
        // Use IPFS dev signal server
        // '/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star',
        "/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star"
        // Use local signal server
        // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
      ]
    }
  }
});

// eslint-disable-next-line
let orbitdb = new OrbitDB(ipfs);

ipfs.on("error", e => console.error(e));

class App extends Component {
  state = {
    ready: false,
    address: ""
  };
  componentWillMount() {
    ipfs.on("ready", async () => {
      console.log("IPFS READY");
      const ipfsPeerInfo = await ipfs.id();

      this.setState({
        ready: true,
        ipfsPeerInfo
      });
    });
  }
  render() {
    return (
      <div className="App">
        <GitHubForkRibbon
          href="//github.com/OR13/create-react-app-orbit-db"
          target="_blank"
          position="right"
        >
          Fork me on GitHub
        </GitHubForkRibbon>
        {this.state.ready && (
          <div>
            {" "}
            {/* <OrbitDBPeerInfo ipfs={ipfs} orbitdb={orbitdb} /> */}
            <DIDResolver orbitdb={orbitdb} />
          </div>
        )}
      </div>
    );
  }
}

export default App;

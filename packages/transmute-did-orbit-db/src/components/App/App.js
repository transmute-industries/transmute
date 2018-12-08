import React, { Component } from "react";
import GitHubForkRibbon from "react-github-fork-ribbon";

import "./App.css";
import DIDDemo from "../DIDDemo";

class App extends Component {
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

        <DIDDemo />
      </div>
    );
  }
}

export default App;

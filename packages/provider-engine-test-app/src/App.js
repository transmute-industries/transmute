import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

const Web3 = require("web3");
const ProviderEngine = require("web3-provider-engine");
const RpcSubprovider = require("web3-provider-engine/subproviders/rpc");

const T = require("transmute-framework");

const RPC_HOST = "http://localhost:8545";

class App extends Component {
  state = {
    accounts: []
  };

  async componentWillMount() {
    const engine = new ProviderEngine();
    engine.addProvider(
      new RpcSubprovider({
        rpcUrl: RPC_HOST
      })
    );
    engine.start();
    const web3 = new Web3(engine);
    let relic = new T.Relic(web3);
    const accounts = await relic.getAccounts();
    this.setState({
      accounts
    });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <pre>{JSON.stringify(this.state.accounts, null, 2)}</pre>
      </div>
    );
  }
}

export default App;

import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import { TransmuteFramework, transmuteConfig } from "./environment.web";

const T = TransmuteFramework.init(transmuteConfig);

console.log(T);

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button
          onClick={() => {
            T.Firebase.login().then(user => {
              console.log(user);
            });
          }}
        >
          Login
        </button>
        <button
          onClick={() => {
            T.Firebase.logout().then(user => {
              console.log(user);
            });
          }}
        >
          Logout
        </button>
        <button
          onClick={() => {
            T.db
              .collection("token_challenges")
              .get()
              .then(querySnapshot => {
                console.log(querySnapshot);
                querySnapshot.forEach(doc => {
                  console.log(`${doc.id} => `, doc.data());
                });
              })
              .catch(err => {
                console.log(err);
              });
          }}
        >
          View Token Requests
        </button>
      </div>
    );
  }
}

export default App;

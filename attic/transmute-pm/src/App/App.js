import React, { Component } from "react";

import "./App.css";

import T from "../transmute";

import PackageManager from '../PackageManager/PackageManager'

class App extends Component {
  state = {
    uid: "none"
  };

  componentWillMount() {
    T.firebaseApp.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user);
        this.setState({
          uid: user.uid
        });
      }
    });
  }

  login = () => {
    T.Firebase.login().then(user => {
      this.setState({
        uid: user.uid
      });
    });
  };

  logout = () => {
    T.Firebase.logout().then(() => {
      this.setState({
        uid: "none"
      });
    });
  };

  render() {
    const renderSessionBtn = () => {
      return this.state.uid === "none" ? (
        <button onClick={this.login}>Login</button>
      ) : (
        <button onClick={this.logout}>Logout</button>
      );
    };

    return (
      <div className="App">
        <div>
          Currently logged in as: {this.state.uid}, {renderSessionBtn()}
        </div>
        <PackageManager currentAddresss={this.state.uid}/>
      </div>
    );
  }
}

export default App;

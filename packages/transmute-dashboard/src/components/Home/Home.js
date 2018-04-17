import React, { Component } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import AppBar from '../AppBar';

class Home extends Component {
  render() {
    return (
      <AppBar>
        <h1>Home</h1>
      </AppBar>
    );
  }
}

export default Home;

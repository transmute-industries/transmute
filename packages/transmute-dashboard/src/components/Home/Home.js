import React, { Component } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import AppBar from '../AppBar';

class Home extends Component {
  render() {
    return (
      <AppBar>
        <h1>Home</h1>
        <button onClick={this.props.go}>Test Location</button>
      </AppBar>
    );
  }
}

const mapStateToProps = state => {
  return {
    // todo: state.todos[0]
  };
};

const mapDispatchToProps = dispatch => {
  return {
    go: () => dispatch(push('/protected'))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

import React from "react";
import { push } from "react-router-redux";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

const Search = props => (
  <div>
    <h1>Search</h1>
    <p>Welcome home!</p>
    <button onClick={() => props.changePage()}>
      Go to about page via redux
    </button>
    <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
      Button
    </button>
  </div>
);

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changePage: () => push("/about-us")
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(Search);

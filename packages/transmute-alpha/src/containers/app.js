import React from "react";
import { Link } from "react-router-dom";
import { push } from "react-router-redux";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { toastMessage } from "../store/toast/actionCreators";

import { default as Routes, routes as pages } from "../pages";
import Header from "./header";

const Progress = ({ search }) => {
  return search.fetching && search.text ? (
    <div
      style={{ width: "100%" }}
      className="mdl-progress mdl-js-progress mdl-progress__indeterminate "
    />
  ) : (
    <div />
  );
};

const App = ({
  location,
  firebase,
  dispatchRaw,
  redirectToPath,
  search,
  toastMessage
}) => (
  <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <Header
      firebase={firebase}
      toastMessage={toastMessage}
      dispatchRaw={dispatchRaw}
      redirectToPath={redirectToPath}
    />
    <div className="mdl-layout__drawer">
      <span className="mdl-layout-title">Title</span>
      <nav className="mdl-navigation">
        <Link className="mdl-navigation__link" to={pages.home.path}>
          Home
        </Link>
        <Link className="mdl-navigation__link" to={pages.search.path}>
          Search
        </Link>
      </nav>
    </div>
    <main className="mdl-layout__content">
      <Progress search={search} />
      {firebase.status !== undefined && (
        <Routes
          firebase={firebase}
          pages={pages}
          location={location}
          redirectToPath={redirectToPath}
        />
      )}
    </main>
    <div id="demo-toast-example" className="mdl-js-snackbar mdl-snackbar">
      <div className="mdl-snackbar__text" />
      <button className="mdl-snackbar__action" type="button" />
    </div>
  </div>
);

const mapStateToProps = state => {
  return {
    firebase: state.firebase,
    location: state.routing.location,
    search: state.search
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      dispatchRaw: action => {
        return action;
      },
      toastMessage,
      redirectToPath: somePath => push(somePath)
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(App);

import React from "react";
import { Route, Link } from "react-router-dom";

import pages from "../pages";

import Search from "../components/search";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

const Progress = ({ search }) => {
  return search.fetching ? (
    <div
      style={{ width: "100%" }}
      className="mdl-progress mdl-js-progress mdl-progress__indeterminate "
    />
  ) : (
    <div />
  );
};

const App = search => (
  <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <header className="mdl-layout__header">
      <div className="mdl-layout__header-row">
        <Link to={pages.home.path} className="xm1 mdl-layout-title">
          XMAS
        </Link>

        <div className="mdl-layout-spacer" />
        <Search />
      </div>
    </header>
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
      <Progress {...search} />

      <Route exact path={pages.home.path} component={pages.home.container} />
      <Route
        exact
        path={pages.search.path}
        component={pages.search.container}
      />
    </main>
  </div>
);

const mapStateToProps = state => {
  return {
    search: state.search
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      // changePage: () => push("/about-us")
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(App);

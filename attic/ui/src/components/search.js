import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as actionCreators from "../store/search/actionCreators";

import * as actions from "../store/search/actions";

const Search = ({ submitSearch, updateSearch, searchText }) => (
  <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable mdl-textfield--floating-label mdl-textfield--align-right">
    <label
      className="mdl-button mdl-js-button mdl-button--icon"
      for="fixed-header-drawer-exp"
    >
      <i className="material-icons">search</i>
    </label>
    <div className="mdl-textfield__expandable-holder">
      <input
        className="mdl-textfield__input"
        type="text"
        name="sample"
        id="fixed-header-drawer-exp"
        onChange={updateSearch}
        onKeyPress={submitSearch}
        value={searchText}
      />
    </div>
  </div>
);

const mapStateToProps = state => {
  return {
    searchText: state.search.text || ""
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateSearch: event => {
      dispatch(actionCreators.updateSearch(event.target.value));
    },
    submitSearch: async event => {
      if (event.charCode === 13) {
        return dispatch(await actions.getSearchResults(event.target.value));
      }
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);

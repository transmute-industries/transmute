import React from "react";
import { push } from "react-router-redux";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

// import Table from "../components/table";


const Home = ({ transmute }) => (
  <div>
    <div className="reduxSection" style={{ padding: "16px" }}>
      <h3>Redux</h3>
      <pre>{JSON.stringify(transmute, null, 2)}</pre>
    </div>

    {/* <div className="factorySection" style={{ padding: "16px" }}>
      <h3>Factory</h3>
      <pre>{JSON.stringify(transmute.factoryReadModelJSON, null, 2)}</pre>
    </div> */}
    {/* <Table data={search.results} /> */}
  </div>
);

const mapStateToProps = state => {
  return {
    search: state.search,
    transmute: state.transmute
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changePage: () => push("/about-us")
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Home);

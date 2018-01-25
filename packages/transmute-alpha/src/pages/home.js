import React from "react";
import { push } from "react-router-redux";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

const renderPackages = packages => {
  // console.log(packages);

  let ignore = ["owner", "whitelisted", "adapterMeta"];

  let keys = Object.keys(packages).filter(v => {
    return ignore.indexOf(v) === -1;
  });

  return (
    <div>
      {keys.map(k => {
        return (
          <div key={k}>
            <a
              href={`http://localhost:8080/ipfs/${k}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {packages[k]}
            </a>
          </div>
        );
      })}
    </div>
  );
};

const Home = ({ transmute, firebase, navigateTo}) => (
  <div style={{ padding: "16px" }}>
    <h3>Transmute Alpha</h3>
    <p>
      This is a work in progress. Please{" "}
      <a
        href="https://github.com/transmute-industries/transmute/issues"
        target="_blank"
        rel="noopener noreferrer"
      >
        open an issue
      </a>{" "}
      on github if you encounter trouble using this demo.
    </p>

    <h4>What is the Transmute Alpha?</h4>
    <p>
      A static content hosting web app and cli tool built with the transmute
      framework. Content is stored on IPFS and tracked via an Ethereum smart
      contract known as the Event Store. This app supports two modes of
      development: centralized and decentralized.
    </p>

    <h4>Centralized Mode</h4>
    <p>
      In this mode, you visit alpha.transmute.industries, and interact with a
      web application that is hosted by transmute industries. This application
      uses IPFS and Ethereum, but you are not the node operator for either in
      this mode.
    </p>

    <h4>Decentralized Mode</h4>
    <p>
      In this mode, you visit localhost:3000, and interact with a web
      application that you are running locally. This application uses IPFS and
      Ethereum, and both are running locally with you as the operator.
    </p>

    {firebase.status !== "LOGGED_IN" && (
      <div>
        <h4>Demo</h4>
        <p>
          In order to protect you and ourselves, we require an email and
          password and for users to register for the full demo. If this concerns
          you, feel free to provide @example.com email.
        </p>
        <button
          className="mdl-button mdl-js-button mdl-button--raised  mdl-button--accent"
          onClick={() => {
            navigateTo("/login");
          }}
        >
          Login for full demo.
        </button>
      </div>
    )}

    {firebase.status === "LOGGED_IN" && (
      <div>
        {/* <h4>User Data From CLI</h4>
        <pre>{JSON.stringify(firebase.userData, null, 2)}</pre> */}

        <h4>Packages</h4>
        {transmute.packageManagerState &&
          renderPackages(transmute.packageManagerState.model)}

        {/* <h4>User Data Rebuilt from IPFS and Ethereum</h4>
        <pre>{JSON.stringify(transmute, null, 2)}</pre> */}

        {/* <h4>Full PackageManger ReadModel</h4>
        <pre>{JSON.stringify(transmute.packageManagerState, null, 2)}</pre> */}
      </div>
    )}
  </div>
);

const mapStateToProps = state => {
  return {
    search: state.search,
    transmute: state.transmute,
    firebase: state.firebase
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      navigateTo: somePath => push(somePath)
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Home);

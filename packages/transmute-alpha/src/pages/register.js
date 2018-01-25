import React from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { push } from "react-router-redux";

import { routes } from "../pages";
import { toastMessage } from "../store/toast/actionCreators";
import firebase from 'firebase'

const Register = ({ transmute, toastMessage, redirectToPath }) => (
  <div>
    <div className="reduxSection" style={{ padding: "16px" }}>
      <h3>Register</h3>
      <form
        onSubmit={event => {
          const { email, password } = event.target;
          event.preventDefault();
          const payload = {
            email: email.value,
            password: password.value
          };
          if (payload.email && payload.password) {
            console.log("submit...");
            firebase
              .auth()
              .createUserWithEmailAndPassword(payload.email, payload.password)
              .then(data => {
                console.log("success: ", data);
                toastMessage("Account registered.");
              })
              .catch(function(error) {
                // Handle Errors here.
                // var errorCode = error.code;
                var errorMessage = error.message;
                toastMessage(errorMessage);
              });
          } else {
            toastMessage("Email and Password are Required.");
          }
        }}
      >
        <div className="mdl-textfield mdl-js-textfield">
          <input
            className="mdl-textfield__input"
            type="email"
            id="email"
            required
          />
          <label className="mdl-textfield__label" for="email">
            Email
          </label>
        </div>
        <br />
        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <input className="mdl-textfield__input" type="email" id="email" />
        <label className="mdl-textfield__label" for="email">
          Email
        </label>
      </div>
      <br />
      <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <input className="mdl-textfield__input" type="password" id="password" />
        <label className="mdl-textfield__label" for="password">
          Password
        </label>
      </div>
        <br />
        <button className="mdl-button mdl-button--accent mdl-js-button mdl-button--raised">
          Register
        </button>
        &nbsp; &nbsp;
        <button
          className="mdl-button mdl-button--primary mdl-js-button"
          onClick={() => {
            redirectToPath(routes.login.path);
          }}
        >
          Login
        </button>
      </form>
    </div>
  </div>
);

const mapStateToProps = state => {
  return {
    transmute: state.transmute
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      toastMessage,
      redirectToPath: somePath => push(somePath)
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Register);

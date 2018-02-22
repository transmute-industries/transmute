import React from "react";

import { bindActionCreators } from "redux";
import { push } from "react-router-redux";

import { connect } from "react-redux";

import { loginUser } from "../store/firebase/actionCreators";

import { toastMessage } from "../store/toast/actionCreators";

import { routes } from "../pages";

import firebase from 'firebase'

const Login = ({ transmute, toastMessage, loginUser, redirectToPath }) => (
  <div>
    <div className="reduxSection" style={{ padding: "16px" }}>
      <h3>Login</h3>
      <form
        onSubmit={event => {
          const { email, password } = event.target;
          event.preventDefault();
          const payload = {
            email: email.value,
            password: password.value
          };
          if (payload.email && payload.password) {
            firebase
              .auth()
              .signInWithEmailAndPassword(payload.email, payload.password)
              .then(user => {
                toastMessage("Logged in as: " + user.uid);
                loginUser(user);
                redirectToPath(routes.home.path);
              })
              .catch(error => {
                // Handle Errors here.
                // var errorCode = error.code;
                var errorMessage = error.message;
                toastMessage(errorMessage);
                // ...
              });
          } else {
            toastMessage("Email and Password are Required.");
          }
        }}
      >
        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input className="mdl-textfield__input" type="email" id="email" />
          <label className="mdl-textfield__label" for="email">
            Email
          </label>
        </div>
        <br />
        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input
            className="mdl-textfield__input"
            type="password"
            id="password"
          />
          <label className="mdl-textfield__label" for="password">
            Password
          </label>
        </div>
        <br />
        <button className="mdl-button mdl-button--accent mdl-js-button mdl-button--raised">
          Login
        </button>
        &nbsp; &nbsp;
        <button
          className="mdl-button mdl-button--primary mdl-js-button"
          onClick={() => {
            redirectToPath(routes.register.path);
          }}
        >
          Register
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
      loginUser,
      redirectToPath: somePath => push(somePath)
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Login);

import React from "react";
import { Link } from "react-router-dom";

import { logout } from "../store/firebase/actions";

import { routes as pages } from "../pages";

const Header = ({ firebase, dispatchRaw, redirectToPath, toastMessage }) => (
  <header className="mdl-layout__header">
    <div className="mdl-layout__header-row">
      <Link to={pages.home.path} className="xm1 mdl-layout-title">
        Transmute
      </Link>
      <div className="mdl-layout-spacer" />
      <button
        id="demo-menu-lower-right"
        className="mdl-button mdl-js-button mdl-button--icon"
      >
        <i className="material-icons">
          {firebase.status === "LOGGED_IN" ? "perm_identity" : "more_vert"}
        </i>
      </button>
      <ul
        className="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect"
        for="demo-menu-lower-right"
      >
        <li className="mdl-menu__item">Dashboard</li>
        {firebase.status === "LOGGED_OUT" && (
          <div>
            <li
              className="mdl-menu__item"
              onClick={() => {
                redirectToPath(pages.login.path);
              }}
            >
              Login
            </li>

            <li
              className="mdl-menu__item"
              onClick={() => {
                redirectToPath(pages.register.path);
              }}
            >
              Register
            </li>
          </div>
        )}
        {firebase.status === "LOGGED_IN" && (
          <li
            className="mdl-menu__item"
            onClick={async () => {
              dispatchRaw(await logout());
              toastMessage("You are now logged out.");
            }}
          >
            Logout
          </li>
        )}
      </ul>
    </div>
  </header>
);

export default Header;

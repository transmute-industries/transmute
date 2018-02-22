import Home from "./home";
import Register from "./register";
import Login from "./login";
import Search from "./search";

import React from "react";
import { Route } from "react-router-dom";


export const routes = {
  home: {
    path: "/",
    container: Home,
    protected: false
  },
  login: {
    path: "/login",
    container: Login,
    protected: false
  },
  register: {
    path: "/register",
    container: Register,
    protected: false
  },
  search: {
    path: "/search",
    container: Search,
    protected: true
  }
};

export const isLocationProtected = (somePath) => {
  const pageKeys = Object.keys(routes);
  let isProtected = true;
  pageKeys.forEach(pageKey => {
    let page = routes[pageKey];
    if (page.path === somePath) {
      isProtected = page.protected;
    }
  });
  return isProtected;
};


export default ({ firebase, pages, location, redirectToPath }) => {
  return (
    <div>
      {Object.keys(pages).map(pageKey => {
        let page = pages[pageKey];
        return (
          <Route
            exact
            path={page.path}
            component={page.container}
            key={pageKey}
          />
        );
      })}
    </div>
  );
};

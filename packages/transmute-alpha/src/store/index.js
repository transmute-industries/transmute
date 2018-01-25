import * as T from "transmute-framework";
import { createStore, applyMiddleware, compose } from "redux";
import { routerMiddleware } from "react-router-redux";
import { push } from "react-router-redux";

import thunk from "redux-thunk";

import createHistory from "history/createBrowserHistory";
import rootReducer from "./reducer";
import { updateSearch } from "./search/actionCreators";

import { routes, isLocationProtected } from "../pages";

import { setUserStatus, setUserData } from "./firebase/actionCreators";
import firebase from "firebase";

import { relic, eventStoreAdapter, readModelAdapter } from "./transmute/init";

import { transmuteInit } from "./transmute/actionCreators";

export const history = createHistory();

const initialState = {};
const enhancers = [];
const middleware = [thunk, routerMiddleware(history)];

if (process.env.NODE_ENV === "development") {
  const devToolsExtension = window.devToolsExtension;

  if (typeof devToolsExtension === "function") {
    enhancers.push(devToolsExtension());
  }
}

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);

const store = createStore(rootReducer, initialState, composedEnhancers);

const config = require("../firebaseConfig");

firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(async user => {
  if (user) {
    store.dispatch(
      setUserStatus({
        status: "LOGGED_IN",
        user
      })
    );
    if (window.location.pathname === routes.login.path) {
      store.dispatch(push(routes.home.path));
    }

    const db = firebase.database();
    const ref = db.ref(`user-data/${user.uid}`);
    const userData = (await ref.once("value")).val();
    store.dispatch(setUserData(userData));

    // now that we have user data retrieved from firebase, we can rebuild read models...

    console.log("USER_DATA FACTORY: ", userData.factory.contractAddress);
    console.log(
      "USER_DATA PACKAGE_MANAGER: ",
      userData.packageManager.contractAddress
    );

    let accounts = await relic.getAccounts();
    let factoryAddress = userData.factory.contractAddress;
    let factory = await T.EventStoreFactory.At(factoryAddress);
    // create a brand new factory
    // let factory = await T.Factory.create(relic.web3, accounts[0]);
    let factoryReadModel = await T.Factory.getReadModel(
      factory,
      eventStoreAdapter,
      readModelAdapter,
      relic.web3,
      accounts[0]
    );

    await factoryReadModel.sync(
      factory,
      eventStoreAdapter,
      relic.web3
    );

    let packageManager = await T.EventStore.At(
      userData.packageManager.contractAddress
    );
    let ps = new T.PackageService(
      relic,
      packageManager,
      eventStoreAdapter,
      readModelAdapter
    );
    await ps.requireLatestReadModel();

    // console.log(factoryReadModel.state);
    // console.log(ps.readModel.state);

    store.dispatch(
      transmuteInit(accounts, factoryReadModel.state, ps.readModel.state)
    );
  } else {
    store.dispatch(
      setUserStatus({
        status: "LOGGED_OUT"
      })
    );
    if (isLocationProtected(window.location.pathname)) {
      store.dispatch(push(routes.login.path));
    }
  }
});

setTimeout(async () => {
  store.dispatch(updateSearch(""));
}, 1 * 1000);

export default store;

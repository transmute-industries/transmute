import { createStore, applyMiddleware } from 'redux';

import createHistory from 'history/createBrowserHistory';

import { routerMiddleware } from 'react-router-redux';

import { default as reducers } from './reducers';

import transmute from './transmute';

export const history = createHistory();

const middleware = routerMiddleware(history);

export const store = createStore(reducers, applyMiddleware(middleware));

transmute.init(store);

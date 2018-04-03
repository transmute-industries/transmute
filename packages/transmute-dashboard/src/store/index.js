import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
// import createHistory from 'history/createBrowserHistory';
// import { routerMiddleware } from 'react-router-redux';
import reducers from '../reducers/index';
import transmute from './transmute';

// export const history = createHistory();
// const middleware = routerMiddleware(history);

export const store = createStore(reducers, compose(applyMiddleware(logger, thunk)));

transmute.init(store);

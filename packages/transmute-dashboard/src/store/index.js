import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import reducers from '../reducers/index';
import transmute from './transmute';

export const store = createStore(reducers, compose(applyMiddleware(logger, thunk)));

transmute.init(store);

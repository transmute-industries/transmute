import { routerReducer } from 'react-router-redux';
import { reducer as transmute } from './transmute/reducer';
import { combineReducers } from 'redux';

export default combineReducers({
  transmute,
  router: routerReducer
});

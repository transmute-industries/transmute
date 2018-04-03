import { combineReducers } from 'redux';
// import { routerReducer } from 'react-router-redux';
import { reducer as transmute } from '../store/transmute/reducer';
import user from "./User";

const OktaAppReducer = combineReducers({
  transmute,
  user: user,
  // router: routerReducer
});

export default OktaAppReducer;
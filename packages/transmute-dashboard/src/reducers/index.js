import { combineReducers } from 'redux';
import { reducer as transmute } from '../store/transmute/reducer';
import user from "./User";

const OktaAppReducer = combineReducers({
  transmute,
  user: user
});

export default OktaAppReducer;
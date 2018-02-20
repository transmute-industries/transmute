import * as actionCreators from './actionCreators';
import * as middleware from './middleware';
import { initialState, reducer } from './reducer';
import init from './init';

export default {
  middleware,
  actionCreators,
  initialState,
  reducer,
  init
};

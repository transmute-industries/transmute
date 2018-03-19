import * as actionCreators from './actionCreators';
import * as middleware from './middleware';
import { initialState, reducer } from './reducer';
import init from './init';

import eventStoreReducers from './eventStoreReducers';

export default {
  middleware,
  actionCreators,
  initialState,
  reducer,
  eventStoreReducers,
  init
};

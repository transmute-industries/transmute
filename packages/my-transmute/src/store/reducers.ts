import { routerReducer } from 'react-router-redux';
// import { reducer as transmuteReducer } from './transmute/reducer';
// import { reducer as formReducer } from 'redux-form';
import { combineReducers } from 'redux';
export default combineReducers({
//   form: formReducer,
  //  transmute: transmuteReducer,
  router: routerReducer
});

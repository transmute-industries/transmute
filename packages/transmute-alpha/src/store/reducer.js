import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import { reducer as search } from './search/reducer'
import { reducer as toast } from './toast/reducer'
import { reducer as transmute } from './transmute/reducer'
import { reducer as firebase } from './firebase/reducer'

export default combineReducers({
  routing: routerReducer,
  search,
  toast,
  transmute,
  firebase
})
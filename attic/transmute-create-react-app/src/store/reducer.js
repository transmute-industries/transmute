import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import { reducer as search } from './search/reducer'
import { reducer as transmute } from './transmute/reducer'

export default combineReducers({
  routing: routerReducer,
  search,
  transmute
})
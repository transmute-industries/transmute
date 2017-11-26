import { createStore, applyMiddleware, Store } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import { routerMiddleware } from 'react-router-redux';

import { createBrowserHistory } from 'history';

const composeEnhancers = composeWithDevTools({});
export const history = createBrowserHistory();
const middleware = [routerMiddleware(history), thunk];

// Here we should import our store type from types and use it!!
function configureStore(): Store<any> {
  return createStore(
    rootReducer,
    {},
    composeEnhancers(
      applyMiddleware(...middleware)
    )
  );
}

export const store = configureStore();

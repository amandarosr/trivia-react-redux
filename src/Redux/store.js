import { applyMiddleware, legacy_createStore as createStore } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from './Reducer/index';

const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(thunk, logger),
  ),
);

if (window.Cypress) {
  window.store = store;
}

export default store;

import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import rootReducer from './reducers';

export const history = createBrowserHistory();
const initialState = {};
const enhancers = [];
const middleware = [
  thunk,
  routerMiddleware(history),
];

// only enable redux devtools when running in development mode
if (process.env.REACT_APP_DEVTOOLS === 'true') {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;
  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers,
);

export default createStore(
  rootReducer(history),
  initialState,
  composedEnhancers,
);

import React, { useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'redux-bundler-react';
import { getNavHelper } from 'internal-nav-helper';

import App from './App';
import cache from './cache';
import getStore from './app-bundles';
import * as serviceWorker from './serviceWorker';

// Function to handle navigation
const handleNavigation = (doUpdateUrl) => {
  const navHelper = getNavHelper(doUpdateUrl);
  return (event) => navHelper(event);
};

cache.getAll().then((initialData) => {
  const store = getStore(initialData);

  if (process.env.NODE_ENV === 'development') window.store = store;

  const onClick = useCallback(handleNavigation(store.doUpdateUrl), [store.doUpdateUrl]);

  ReactDOM.render(
    <Provider store={store}>
      <div onClick={onClick}>
        <App />
      </div>
    </Provider>,
    document.getElementById('root')
  );
}).catch((error) => {
  console.error('Failed to get cache:', error);
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

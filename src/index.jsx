import ReactDOM from 'react-dom';
import { Provider } from 'redux-bundler-react';
import { getNavHelper } from 'internal-nav-helper';

import App from './App';
import cache from './cache';
import getStore from './app-bundles';

import NavigateWarningModal from './common/modals/NavigateWarningModal';

import '@trussworks/react-uswds/lib/uswds.css';
import '@trussworks/react-uswds/lib/index.css';

const enhancedNavHelper = (store) => {
  const originalNavHelper = getNavHelper(store.doUpdateUrl);

  return (event) => {
    let target = event.target;
    while (target && target.nodeName !== 'A') {
      target = target.parentNode;
    }

    if (target && target.getAttribute('href')) {
      const targetPath = target.getAttribute('href');
      const currentPath = store.selectPathname();

      if (
        (currentPath.endsWith('/missouri-river') || currentPath.endsWith('/search-effort')) &&
        (!targetPath.endsWith('/missouri-river') || !targetPath.endsWith('/search-effort'))
      ) {
        event.preventDefault(); // Prevent default navigation
        store.doModalOpen(NavigateWarningModal, { url: targetPath });
      } else {
        originalNavHelper(event); // Proceed with normal navigation
      }
    }
  };
};

cache.getAll().then((initialData) => {
  const store = getStore(initialData);
  const navHelper = enhancedNavHelper(store);

  if (import.meta.env.VITE_ENVIRONMENT === 'local') window.store = store;

  ReactDOM.render(
    <Provider store={store}>
      <div onClick={navHelper}>
        <App />
      </div>
    </Provider>,
    document.getElementById('root')
  );
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

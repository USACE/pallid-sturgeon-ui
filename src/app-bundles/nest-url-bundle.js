import pkg from '../../package.json';
import { createSelector } from 'redux-bundler';

const nestedUrl = {
  name: 'nestedUrl',

  doUpdateUrlWithHomepage: path => ({ store }) => {
    if (!pkg || !pkg.homepage) return store.doUpdateUrl(path);
    store.doUpdateUrl(`${pkg.homepage}${path}`);
  },

  selectPathnameMinusHomepage: createSelector('selectPathname', pathname => {
    if (!pkg || !pkg.homepage) return pathname;

    const matcher = new RegExp(pkg.homepage);
    return pathname.replace(matcher, '');
  }),
};

export default nestedUrl;

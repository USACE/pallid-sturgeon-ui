import { createRouteBundle } from 'redux-bundler';

import DataSheet from '../app-pages/data-summaries/datasheet/dataSheet';
import DataUpload from '../app-pages/data-upload/dataUpload';
import ErrorLog from '../app-pages/data-entry/errorLog';
import GeneticCard from '../app-pages/data-summaries/geneticCard';
import Home from '../app-pages/home/home';
import Logout from '../app-pages/logout';
import Map from '../app-pages/map/map';
import NotFound from '../app-pages/404';
import SignUp from '../app-pages/signup/signup';
import SiteSearch from '../app-pages/data-entry/siteSearch';
import SitesList from '../app-pages/data-entry/sitesList';

export default createRouteBundle(
  {
    '': Home,
    '/': Home,
    '/data-upload': DataUpload,
    '/error-log': ErrorLog,
    '/data-sheet': DataSheet,
    '/genetics-card-summary': GeneticCard,
    '/logout': Logout,
    '/map': Map,
    '/signup': SignUp,
    '/site-search': SiteSearch,
    '/sites-list': SitesList,
    '*': NotFound,
  }
);

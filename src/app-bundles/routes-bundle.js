import { createRouteBundle } from 'redux-bundler';

import SitesList from '../app-pages/data-entry/sites-list';
import DataEntry from '../app-pages/data-entry/datasheets';
import DataSheet from '../app-pages/data-summaries/datasheet/dataSheet';
import DataUpload from '../app-pages/data-upload/dataUpload';
import ErrorLog from '../app-pages/utilities/errorLog';
import GeneticCard from '../app-pages/data-summaries/geneticCard';
import Home from '../app-pages/home/home';
import Logout from '../app-pages/logout';
import Map from '../app-pages/map/map';
import NotFound from '../app-pages/404';
import SignUp from '../app-pages/signup/signup';
import SearchReports from 'app-pages/data-summaries/search-reports';

export default createRouteBundle(
  {
    '': Home,
    '/': Home,
    '/data-entry': DataEntry,
    '/data-upload': DataUpload,
    '/error-log': ErrorLog,
    '/data-sheet': DataSheet,
    '/genetics-card-summary': GeneticCard,
    '/search-reports': SearchReports,
    '/sites-list': SitesList,
    '/logout': Logout,
    '/map': Map,
    '/signup': SignUp,
    '*': NotFound,
  }
);

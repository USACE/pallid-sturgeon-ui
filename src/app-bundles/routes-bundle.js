import { createRouteBundle } from 'redux-bundler';

import DataSheet from '../app-pages/data-summaries/dataSheet';
import DataUpload from '../app-pages/data-upload/dataUpload';
import ErrorLog from '../app-pages/data-entry/errorLog';
import GeneticCard from '../app-pages/data-summaries/geneticCard';
import Home from '../app-pages/home/home';
import Logout from '../app-pages/logout';
import Map from '../app-pages/map/map';
import MissouriRiverDataSheet from '../app-pages/data-summaries/missouriRiverDataSheet';
import NotFound from '../app-pages/404';
import SignUp from '../app-pages/signup/signup';
import SiteSearch from '../app-pages/data-entry/siteSearch';
import SitesList from '../app-pages/data-entry/sitesList';
import SupplementalDataSheet from '../app-pages/data-summaries/supplementalDataSheet';

export default createRouteBundle(
  {
    '': Home,
    '/': Home,
    '/data-upload': DataUpload,
    '/error-log': ErrorLog,
    '/data-sheet': DataSheet,
    '/genetic-card': GeneticCard,
    '/logout': Logout,
    '/map': Map,
    '/missouri-river-data-sheet': MissouriRiverDataSheet,
    '/signup': SignUp,
    '/site-search': SiteSearch,
    '/sites-list': SitesList,
    '/supplemental-data-sheet': SupplementalDataSheet,
    '*': NotFound,
  }
);

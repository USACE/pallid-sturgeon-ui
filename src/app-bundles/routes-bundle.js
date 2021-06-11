import { createRouteBundle } from 'redux-bundler';
import MissouriRiverDataSheet from '../app-pages/data-summaries/missouriRiverDataSheet';
import FishDataSheet from '../app-pages/data-summaries/fishDataSheet';
import SupplementalDataSheet from '../app-pages/data-summaries/supplementalDataSheet';
import GeneticCard from '../app-pages/data-summaries/geneticCard';
import SitesList from '../app-pages/data-entry/sitesList';
import SiteSearch from '../app-pages/data-entry/siteSearch';
import ErrorLog from '../app-pages/data-entry/errorLog';
import DataUpload from '../app-pages/data-upload/dataUpload';
import Map from '../app-pages/map/map';
import Home from '../app-pages/home/home';
import Logout from '../app-pages/logout';
import NotFound from '../app-pages/404';
import SignUp from '../app-pages/signup/signup';

export default createRouteBundle(
  {
    '': Home,
    '/': Home,
    '/missouri-river-data-sheet': MissouriRiverDataSheet,
    '/fish-data-sheet': FishDataSheet,
    '/supplemental-data-sheet': SupplementalDataSheet,
    '/genetic-card': GeneticCard,
    '/sites-list': SitesList,
    '/site-search': SiteSearch,
    '/error-log': ErrorLog,
    '/data-upload': DataUpload,
    '/map': Map,
    '/logout': Logout,
    '/signup': SignUp,
    '*': NotFound,
  }
);

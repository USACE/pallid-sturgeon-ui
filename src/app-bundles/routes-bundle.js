import { createRouteBundle } from 'redux-bundler';
import MissouriRiverDataSheet from '../app-pages/datasummaries/missouriRiverDataSheet';
import FishDataSheet from '../app-pages/datasummaries/fishDataSheet';
import SupplementalDataSheet from '../app-pages/datasummaries/supplementalDataSheet';
import GeneticCard from '../app-pages/datasummaries/geneticCard';
import SitesList from '../app-pages/dataentry/sitesList';
import SiteSearch from '../app-pages/dataentry/siteSearch';
import ErrorLog from '../app-pages/dataentry/errorLog';
import DataUpload from '../app-pages/dataupload/dataUpload';
import Map from '../app-pages/map/map';
import Home from '../app-pages/home/home';
import Logout from '../app-pages/logout';
import NotFound from '../app-pages/404';
import Profile from '../app-pages/profile/userProfile';
import SignUp from '../app-pages/signup/signup';

export default createRouteBundle(
  {
    '': Home,
    '/': Home,
    '/missouriRiverDataSheet': MissouriRiverDataSheet,
    '/fishDataSheet': FishDataSheet,
    '/supplementalDataSheet': SupplementalDataSheet,
    '/geneticCard': GeneticCard,
    '/sitesList': SitesList,
    '/siteSearch': SiteSearch,
    '/errorLog': ErrorLog,
    '/dataUpload': DataUpload,
    '/map': Map,
    '/logout': Logout,
    '/signup': SignUp,
    '/profile': Profile,
    '*': NotFound,
  }
);

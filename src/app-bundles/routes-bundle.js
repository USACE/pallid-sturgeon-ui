import { createRouteBundle } from 'redux-bundler';

import SitesList from '../app-pages/data-entry/sites-list';
import DataEntry from '../app-pages/data-entry/datasheets';
import DataSheet from '../app-pages/data-summaries/datasheet/dataSheet';
import DataUpload from '../app-pages/data-upload/dataUpload';
import EditDataSheet from 'app-pages/data-entry/edit-data-sheet/editDataSheet';
import ErrorLog from '../app-pages/utilities/errorLog';
import GeneticCard from '../app-pages/data-summaries/geneticCard';
import Home from '../app-pages/home/home';
import Logout from '../app-pages/logout';
import Map from '../app-pages/map/map';
import NotFound from '../app-pages/404';
import SignUp from '../app-pages/signup/signup';
import SearchReports from 'app-pages/data-summaries/search-reports';
import CreateNewSite from 'app-pages/data-entry/sites-list/pages/create-new-site';
import PriorityFish from 'app-pages/data-summaries/priorityFish';
import LastLocation from 'app-pages/data-summaries/lastLocation';
import TagReplacement from 'app-pages/data-summaries/tagReplacement';

export default createRouteBundle(
  {
    '': Home,
    '/': Home,
    '/data-sheet': DataSheet,
    '/data-upload': DataUpload,
    '/error-log': ErrorLog,
    '/find-data-sheet': DataEntry,
    '/find-data-sheet/edit-data-sheet': EditDataSheet,
    '/genetics-card-summary': GeneticCard,
    '/last-location': LastLocation,
    '/logout': Logout,
    '/map': Map,
    '/priority-fish': PriorityFish,
    '/search-reports': SearchReports,
    '/signup': SignUp,
    '/sites-list': SitesList,
    '/sites-list/create-new-site': CreateNewSite,
    '/tag-replacement': TagReplacement,
    '*': NotFound,
  }
);

import { createRouteBundle } from 'redux-bundler';

import SitesList from '@pages/sites-list/SitesList';
import DataEntry from '@pages/data-entry/datasheets';
import DataSheet from '@pages/data-summaries/datasheet/dataSheet';
import DataQuery from '@pages/admin/data-query';
import DataUpload from '@pages/data-upload/dataUpload';
import ErrorLog from '@pages/utilities/errorLog';
import GeneticCard from '@pages/data-summaries/geneticCard';
import Home from '@pages/home/home';
import Logout from '@pages/logout';
import Map from '@pages/map/map';
import UserList from '@pages/admin/userList';
import NotFound from '@pages/404';
import SearchReports from '@pages/data-summaries/search-reports';
import PriorityFish from '@pages/data-summaries/priorityFish';
import LastLocation from '@pages/data-summaries/lastLocation';
import TagReplacement from '@pages/data-summaries/tagReplacement';
import MultipleRecordApproval from '@pages/admin/multipleRecordApproval';
import SiteDatasheet from '@pages/data-entry/datasheets/pages/site-datasheet';
import Users from '@pages/admin/users/Users';
import MissouriRiverForm from '@src/app-pages/data-entry/edit-data-sheet/forms/missouriRiverForm';
import SearchEffortForm from '@src/app-pages/data-entry/edit-data-sheet/forms/searchEffortForm';

export default createRouteBundle({
  '': Home,
  '/': Home,
  '/data-sheet': DataSheet,
  '/data-query': DataQuery,
  '/data-upload': DataUpload,
  '/users': Users,
  '/error-log': ErrorLog,
  '/find-data-sheet': DataEntry,
  '/genetics-card-summary': GeneticCard,
  '/last-location': LastLocation,
  '/logout': Logout,
  '/map': Map,
  '/multiple-record-approval': MultipleRecordApproval,
  '/priority-fish': PriorityFish,
  '/search-reports': SearchReports,
  '/sites-list': SitesList,
  '/sites-list/:id': SiteDatasheet,
  '/sites-list/:id/missouri-river': MissouriRiverForm,
  '/sites-list/:id/search-effort': SearchEffortForm,
  '/tag-replacement': TagReplacement,
  '/user-access-requests': UserList,
  '*': NotFound,
});

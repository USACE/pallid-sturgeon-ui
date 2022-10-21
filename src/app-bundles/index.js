import {
  composeBundles,
  createCacheBundle,
  createUrlBundle,
} from 'redux-bundler';
import createAuthBundle from './create-auth-bundle';
import createJwtApiBundle from './create-jwt-api-bundle';
import cache from '../cache';

import dataEntryBundle from './data-entry-bundle';
import datasheetPageBundle from './datasheet-page-bundle';
import domainsBundle from './domains-bundle';
import notificationBundle from './notification-bundle';
import modalBundle from './modal-bundle';
import routesBundle from './routes-bundle';
import searchReportsPageBundle from './search-reports-page-bundle';
import sitesBundle from './sites-bundle';
import uploadBundle from './upload-bundle';
import homeDataBundle from './home-data-bundle';
import geneticCardSummaryBundle from './genetic-card-summary-bundle';
import authBundle from './auth-bundle';
import userAccessRequestBundle from './users-access-request-bundle';
import rolesBundle from './roles-bundle';
import usersBundle from './users-bundle';
import sitesDatasheetBundle from './sites-datasheet-bundle';
import exportsBundle from './exports/exports-bundle';

// Mock Token User
const mockTokenApplicationAdmin =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwibmFtZSI6IlVzZXIuQXBwbGljYXRpb25BZG1pbiIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMDAwMDAwMDAwLCJyb2xlcyI6W119.aKaDNBnuhQyXI6zvzn-dAg8SxJSP3mQEx5FTSmJbYog';

export default composeBundles(
  createAuthBundle({
    appId: '07f1223f-f208-4b71-aa43-5d5f27cd8ed9',
    redirectOnLogout: '/',
    mock: process.env.NODE_ENV === 'development' ? true : false,
    token: process.env.NODE_ENV === 'development' ? mockTokenApplicationAdmin : null,
  }),
  createJwtApiBundle({
    root: process.env.REACT_APP_API_URL,
    tokenSelector: 'selectAuthToken',
    unless: {
    },
  }),
  createCacheBundle({
    cacheFn: cache.set,
  }),
  createUrlBundle(),
  dataEntryBundle,
  datasheetPageBundle,
  domainsBundle,
  geneticCardSummaryBundle,
  homeDataBundle,
  modalBundle,
  notificationBundle,
  routesBundle,
  searchReportsPageBundle,
  sitesBundle,
  uploadBundle,
  authBundle,
  userAccessRequestBundle,
  rolesBundle,
  usersBundle,
  sitesDatasheetBundle,
  exportsBundle,
);

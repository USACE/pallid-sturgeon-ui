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
import userAccessRequestBundle from './users-access-request-bundle';
import rolesBundle from './roles-bundle';
import fieldOfficesBundle from './field-offices-bundle';

// Mock Token User
// const mockTokenApplicationAdmin =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwibmFtZSI6IlVzZXIuQXBwbGljYXRpb25BZG1pbiIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMDAwMDAwMDAwLCJyb2xlcyI6W119.aKaDNBnuhQyXI6zvzn-dAg8SxJSP3mQEx5FTSmJbYog';

const mockTokenApplicationAdmin =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTI5Nzk1MDQsImlhdCI6MTY1Mjk3OTIwNCwianRpIjoiMzgxYzAxZGItYWEwYi00OWMxLTlhNzktMGI1ZWQyMmYyYzY2IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDg5L2F1dGgvcmVhbG1zL0NXQkktREVWIiwiYXVkIjpbImNzcGkiLCJhY2NvdW50Il0sInN1YiI6IjY5NDQwOTFmLTJjZmYtNDBmNC05NzUxLTE5YjViMTgxZjcyZCIsInR5cCI6IkJlYXJlciIsImF6cCI6InBhbGxpZC1zdHVyZ2Vvbi1kZXYiLCJzZXNzaW9uX3N0YXRlIjoiODczMTgzYjYtODQ5My00M2E3LWJlMzQtNmZmNWRjOThmNmY0IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vbG9jYWxob3N0OjMwMDAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJwYWxsaWQtc3R1cmdlb24tZGV2Ijp7InJvbGVzIjpbIkFETUlOSVNUUkFUT1IiXX0sImNzcGkiOnsicm9sZXMiOlsiZ2VuZXJpYy11c2VyIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBlbWFpbCBwcm9maWxlIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoiS2V2aW4gSmFja3NvbiIsInByZWZlcnJlZF91c2VybmFtZSI6ImtldmluLXRlc3QiLCJnaXZlbl9uYW1lIjoiS2V2aW4iLCJmYW1pbHlfbmFtZSI6IkphY2tzb24iLCJlbWFpbCI6ImtldmluLmouamFja3NvbkB1c2FjZS5hcm15Lm1pbCJ9.ay07KfuYjQI6sGnUGZ64RQTXQ3P3rofx735ax3wz6GQ';
export default composeBundles(
  createAuthBundle({
    appId: '07f1223f-f208-4b71-aa43-5d5f27cd8ed9',
    redirectOnLogout: '/',
    mock: process.env.REACT_APP_IS_MOCK === 'true' ? true : false,
    token: process.env.REACT_APP_IS_MOCK === 'true' ? mockTokenApplicationAdmin : null,
  }),
  createJwtApiBundle({
    root: process.env.REACT_APP_API_URL,
    tokenSelector: 'selectAuthTokenRaw',
    unless: {},
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
  userAccessRequestBundle,
  rolesBundle,
  fieldOfficesBundle,
);

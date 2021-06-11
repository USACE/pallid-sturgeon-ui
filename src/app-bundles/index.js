import {
  composeBundles,
  createCacheBundle,
  createUrlBundle,
} from 'redux-bundler';
import createAuthBundle from './create-auth-bundle';
import createJwtApiBundle from './create-jwt-api-bundle';
import cache from '../cache';

import modalBundle from './modal-bundle';
import notificationBundle from './notification-bundle';
import routesBundle from './routes-bundle';

// Mock Token User
const mockTokenPublic =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwIiwibmFtZSI6IlVzZXIuVGVzdCIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMDAwMDAwMDAwLCJyb2xlcyI6W119._N-sAWgMhYsWhwIf44_SGSMGSgnnM8tntlswsBqjYDo';
const mockTokenApplicationAdmin =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwibmFtZSI6IlVzZXIuQXBwbGljYXRpb25BZG1pbiIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMDAwMDAwMDAwLCJyb2xlcyI6W119.aKaDNBnuhQyXI6zvzn-dAg8SxJSP3mQEx5FTSmJbYog';
const mockTokenProjectAdmin =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwibmFtZSI6IlVzZXIuUHJvamVjdEFkbWluIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjIwMDAwMDAwMDAsInJvbGVzIjpbXX0.P2Cb6s3Kq0hHsfXEczFcUvpQuR8TTV88U4RDvcPabMM';
const mockTokenProjectMember =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0IiwibmFtZSI6IlVzZXIuUHJvamVjdE1lbWJlciIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMDAwMDAwMDAwLCJyb2xlcyI6W119.ujBvw9bCksuSbXGJreIpdXZcVIHtb8GhgviBTvrO9AQ';

export default composeBundles(
  createAuthBundle({
    appId: '07f1223f-f208-4b71-aa43-5d5f27cd8ed9',
    redirectOnLogout: '/',
    mock: process.env.NODE_ENV === 'development' ? true : false,
    token: process.env.NODE_ENV === 'development' ? mockTokenApplicationAdmin : null,
  }),
  createJwtApiBundle({
    root:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:80'
        : process.env.REACT_APP_API_URL,
    tokenSelector: 'selectAuthTokenRaw',
    unless: {
      // GET requests do not include token unless path starts with /my_ or includes /members/
      // Need token to figure out who "me" is
      custom: ({ method, path }) => {
        if (method === 'GET') {
          if (path.slice(0, 4) === '/my_' || path.includes('/members')) {
            return false;
          }
          return true;
        }
        return false;
      },
    },
  }),
  createCacheBundle({
    cacheFn: cache.set,
  }),
  createUrlBundle(),
  modalBundle,
  notificationBundle,
  routesBundle,
);
